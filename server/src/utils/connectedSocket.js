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
        if (!this.userDataPresent) {
            if (message.type !== 'send token') {
                this.socket.send(JSON.stringify({type: 'error', message: 'error token not sent'}));
                return;
            }
            const userData = UserProcesses.getUserFromToken(message.token);
            if (!userData) {
                this.socket.send(JSON.stringify({type: 'error', message: 'error token not found'}));
                return;
            }
            userData.socket = this.socket;
            this.socket.send(JSON.stringify({type: 'acknowledgement', success: true}));
            this.userDataPresent = true;
            this.timer = setTimeout(()=>this.onSocketClose(), 3600000);
            return;
        }

        GameProcesses.updateGame(message)
            .catch(err=>this.socket.send(JSON.stringify({
                success: false,
                message: err.message
            })));

        clearTimeout(this.timer);
        this.timer = setTimeout(()=>this.onSocketClose(), 3600000);
    }
}
