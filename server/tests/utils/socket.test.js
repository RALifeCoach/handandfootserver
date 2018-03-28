import Socket from '../../src/utils/socket';
import UserProcesses from "../../src/processes/userProcesses";
import GameProcesses from "../../src/processes/gameProcesses";
import * as ConnectedSocket from '../../src/utils/connectedSocket';
import * as uuid from 'uuid';

describe('Socket', ()=> {
    let socket;
    beforeAll(()=>{
        socket = Socket;
    });

    describe("onConnect", ()=>{
        test("instantiate a new SocketConnection and store it in the object.", ()=>{
            spyOn(uuid, 'default').and.returnValue('uuid1');
            spyOn(ConnectedSocket, 'default').and.returnValue({
                className: 'ConnectedSocket'
            });

            socket.onConnect('socket');

            for (let sock in socket.sockets) {
                if (socket.sockets.hasOwnProperty(sock)) {
                    expect(socket.sockets[sock]).toEqual({
                        className: 'ConnectedSocket'
                    });
                }
            }
        });
    });

    describe('onClose', () => {
        test("delete the socket from the object.", ()=>{
            let connection;
            for (let sock in socket.sockets) {
                if (socket.sockets.hasOwnProperty(sock)) {
                    connection = sock;
                    break;
                }
            }

            socket.onClose(connection);

            expect(socket.sockets).toEqual({});
        });
    });
});
