import UserProcesses from './../processes/userProcesses';
import GameProcesses from './../processes/gameProcesses';

export default class ConnectedSocket {
    constructor (socket, guid, onClose) {
        this.socket = socket;
        this.guid = guid;
        this.userDataPresent = false;
        this.onClose = onClose;
        this.timer = null;
        this.handleSocketMessages();
    }

    handleSocketMessages() {
        this.socket.send(JSON.stringify({
            type: 'request token'
        }));
        this.socket.on('close', ()=>this.onSocketClose(socket));
        this.socket.on('message', request=>this.onMessage(JSON.parse(request)));
    }

    onSocketClose() {
        const userData = UserProcesses.getUserFromSocket(this.socket);
        userData.socket = null;
        UserProcesses.disconnectPlayer(userData.user);
        this.userDataPresent = false;
        this.onClose(this.guid);
    }

    onMessage(message) {
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
