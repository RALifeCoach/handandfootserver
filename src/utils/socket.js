import WebSocket from 'ws';
import ConnectedSocket from './connectedSocket';
import uuid from 'uuid/v1';

export class Socket {
    constructor () {
        this.wss = null;
        this.sockets = {};
    }

    openSocket(port) {
        try {
            this.wss = new WebSocket.Server({port: port});
        } catch (err) {
            throw err;
        }

        this.wss.on('connection', socket => this.onConnect(socket));
    }

    onConnect(socket) {
        const guid = uuid();
        this.sockets[guid] = new ConnectedSocket(socket, guid, (guid)=>this.onClose(guid));
    }

    onClose(guid) {
        delete this.sockets[guid];
    }
}

export default new Socket();
