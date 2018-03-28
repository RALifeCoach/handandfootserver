import ConnectedSocket from '../../src/utils/connectedSocket';
import UserProcesses from "../../src/processes/userProcesses";
import GameProcesses from "../../src/processes/gameProcesses";

describe("ConnectedSocket", ()=>{
    let module;

    describe("constructor", ()=>{
        test("construct connected socket and handle socket events", ()=>{
            const socket = {
                on: jasmine.createSpy(),
                send: jasmine.createSpy()
            };

            module = new ConnectedSocket(socket, 'uuid', 'onClose');

            expect(socket.on).toHaveBeenCalledWith('close', jasmine.any(Function));
            expect(socket.on).toHaveBeenCalledWith('message', jasmine.any(Function));
            expect(module.socket).toBe(socket);
            expect(module.guid).toBe('uuid');
            expect(module.userDataPresent).toBe(false);
            expect(module.onClose).toBe('onClose');
            expect(module.timer).toEqual(null);
        });
    });

    describe("onSocketClose", ()=>{
        test("construct connected socket and handle socket events", ()=>{
            const userData = {
                socket: 'socket',
                user: 'user'
            };
            module.onClose = jasmine.createSpy();
            module.guid = 'uuid';
            spyOn(UserProcesses, 'getUserFromSocket').and.returnValue(userData);
            spyOn(UserProcesses, 'disconnectPlayer');

            module.onSocketClose();

            expect(userData).toEqual({
                socket: null,
                user: 'user'
            });
            expect(UserProcesses.disconnectPlayer).toHaveBeenCalledWith('user');
            expect(module.userDataPresent).toBe(false);
            expect(module.onClose).toHaveBeenCalledWith('uuid')
        });
    });

    describe("onMessage", ()=>{
        let userData;

        beforeEach(()=>{
            module.socket = {
                send: jasmine.createSpy()
            };
            userData = {
                socket: null
            };
            module.timer = 'timer';
            spyOn(UserProcesses, 'getUserFromToken').and.returnValue(userData);
            spyOn(global, 'clearTimeout');
            spyOn(global, 'setTimeout').and.returnValue('new timer');
        });

        test("In initial call, establish the connection and token (message not send token).", ()=>{
            module.userDataPresent = false;

            module.onMessage({
                type: 'xxx'
            });

            expect(module.socket.send).toHaveBeenCalledWith(JSON.stringify({type: 'error', message: 'error token not sent'}));
        });

        test("In initial call, establish the connection and token (token not found).", ()=>{
            module.userDataPresent = false;
            UserProcesses.getUserFromToken.and.returnValue(null);

            module.onMessage({
                type: 'send token',
                token: 'token'
            });

            expect(module.socket.send).toHaveBeenCalledWith(JSON.stringify({type: 'error', message: 'error token not found'}));
        });

        test("In initial call, establish the connection and token (ok).", ()=>{
            module.userDataPresent = false;

            module.onMessage({
                type: 'send token',
                token: 'token'
            });

            expect(module.socket.send).toHaveBeenCalledWith(JSON.stringify({type: 'acknowledgement', success: true}));
            expect(module.userDataPresent).toBe(true);
            expect(window.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 3600000);
        });

        test("Call updateGame.", (done)=>{
            module.userDataPresent = true;
            const promise = new Promise((resolve, reject)=> {
                resolve();
            }).then(()=>{
                done();
            });
            spyOn(GameProcesses, 'updateGame').and.returnValue(promise);

            module.onMessage('message');

            expect(GameProcesses.updateGame).toHaveBeenCalledWith('message');
            expect(global.clearTimeout).toHaveBeenCalledWith('timer');
            expect(global.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 3600000);
            expect(module.timer).toBe('new timer');
        });
    });
});