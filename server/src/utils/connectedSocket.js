import UserProcesses from './../processes/userProcesses';
import GameProcesses from './../processes/gameProcesses';
import {refreshList} from "../../../client/src/actions/games-actions";

export default class ConnectedSocket {
    constructor (socket, guid, onClose, store) {
        this.socket = socket;
        this.guid = guid;
        this.userDataPresent = false;
        this.onClose = onClose;
        this.timer = null;
        this.store = store;
        this.handleSocketMessages();
    }

    handleSocketMessages() {
        this.socket.on('close', ()=>this.onSocketClose());
        this.socket.on('message', request=>this.onMessage(request));
    }

    onSocketClose() {
        const userData = UserProcesses.getUserFromSocket(this.socket);
        if (userData) {
            userData.socket = null;
            UserProcesses.disconnectPlayer(userData.user);
        }
        this.userDataPresent = false;
        this.onClose(this.guid);
    }

    onMessage(request) {
        const message = JSON.parse(request);
        console.log('socket', message);
        if (!this.userDataPresent || message.type === 'send token') {
            if (message.type !== 'send token') {
                this.socket.send(JSON.stringify({type: 'error', message: 'error token not sent'}));
                return;
            }
            this.userData = UserProcesses.getUserFromToken(message.token);
            if (!this.userData) {
                this.socket.send(JSON.stringify({type: 'reconnect', message: 'error token not found'}));
                return;
            }
            this.userData.socket = this.socket;
            this.socket.send(JSON.stringify({type: 'acknowledgement', success: true}));
            this.userDataPresent = true;
            this.timer = setTimeout(()=>this.onSocketClose(), 3600000);
            return;
        }

        if (message.type === 'join game' || message.type === 'rejoin game') {
            message.updateData = {
                user: this.userData.user
            };
            this.userData.direction = message.direction;
        }

        console.log('message: ' + JSON.stringify(message));
        GameProcesses.updateGame(message)
            .catch(err=>{
                console.log(err.stack);
                this.socket.send(JSON.stringify({
                    success: false,
                    message: err.message
                }));
            });

        clearTimeout(this.timer);
        this.timer = setTimeout(()=>this.onSocketClose(), 3600000);
    }
}
