import WebSocket from 'ws';
import UserProcesses from './../processes/userProcesses';
import GameProcesses from './../processes/gameProcesses';

class Socket {
    constructor() {
        this.users = {};
        const wss = new WebSocket.Server({ port: 8092 });

        wss.on('connection', function connection(socket) {
            let user = null;
            socket.send({
                type: 'request token'
            });
            socket.on('message', message => {
                if (!user) {
                    if (message.type !== 'send token') {
                        throw new Error('missing token');
                    }
                    user = UserProcesses.getUserFromToken(message.token);
                    user.socket = socket;
                    this.users[socket.id] = user;
                }
                this.processMessage(message, this.users[socket.id]);
            });
        });
    }

    processMessage(message, user) {
        switch (message.type) {
            case 'join game':
                GameProcesses.joinGame(message.gameName, message.direction, user)
                    .then(()=>{
                        this.broadcastAll({
                            type: 'player joined',
                            user,
                            direction: message.direction
                        })
                    })
                    .catch(ex => {
                        throw ex;
                    });
                break;
            default:
                break;
        }
    }
}

export default new Socket();
