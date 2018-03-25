import WebSocket from 'ws';
import UserProcesses from './../processes/userProcesses';
import GameProcesses from './../processes/gameProcesses';

export class Socket {
    constructor() {
        const wss = new WebSocket.Server({ port: 8092 });

        wss.on('connection', socket => {
            let userData = null;
            socket.send(JSON.stringify({
                type: 'request token'
            }));
            socket.on('close', ()=>console.log('close'));
            socket.on('message', response => {
                const message = JSON.parse(response);
                console.log(message.type);
                if (!userData) {
                    if (message.type !== 'send token') {
                        socket.send(JSON.stringify({type: 'error', message: 'error token not sent'}));
                        return;
                    }
                    userData = UserProcesses.getUserFromToken(message.token);
                    if (!userData) {
                        console.log(message);
                        socket.send(JSON.stringify({type: 'error', message: 'error token not found'}));
                        return;
                    }
                    userData.socket = socket;
                    socket.send(JSON.stringify({type: 'acknowledgement', success: true}));
                    return;
                }
                this.processMessage(message, UserProcesses.getUserFromToken(message.token))
                    .then(()=>{
                        UserProcesses.broadcastToAllUsers({
                            type: 'player joined',
                            gameName: message.gameName,
                            playerName: userData.user.name,
                            direction: message.direction
                        });
                    })
                    .catch(err=>socket.send(JSON.stringify({
                        type: 'acknowledgement',
                        success: false,
                        message: err.stack
                    })));
            });
        });
    }

    async processMessage(message, userData) {
        switch (message.type) {
            case 'join game':
                try {
                    const gameStarted = await GameProcesses.joinGame(message.gameName, message.direction, userData);
                } catch(ex) {
                    throw ex;
                }
                break;
            default:
                await setTimeout(()=>{}, 0);
                break;
        }
    }
}

export default new Socket();
