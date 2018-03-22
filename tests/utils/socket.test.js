global.WebSocket = {
    Server: {
        on: jasmine.createSpy(),
        send: jasmine.createSpy()
    }
};
import Socket from '../../src/utils/socket';
import UserProcesses from "../../src/processes/userProcesses";
import GameProcesses from "../../src/processes/gameProcesses";

describe('Socket', ()=> {
    describe('Socket.processMessage', () => {
        let message,
            userData;

        beforeEach(()=>{
            message = {
                type: 'join game',
                gameName: 'gn1',
                direction: 'dir'
            };
            userData = {
                user: {
                    name: 'un1'
                }
            };
            spyOn(GameProcesses, 'joinGame').and.callFake(()=>{
                return new Promise(resolve=>{
                    setTimeout(()=>resolve('game started data'), 100);
                });
            });
            spyOn(UserProcesses, 'broadcastToAllUsers');
        });

        it("Test 'join game' message (join game returns game content)", (done) => {
            Socket.processMessage(message, userData).then(()=>{
                expect(GameProcesses.joinGame).toHaveBeenCalledWith('gn1', 'dir', userData);
                expect(UserProcesses.broadcastToAllUsers).toHaveBeenCalledWith({
                    type: 'player joined',
                    gameName: 'gn1',
                    playerName: 'un1',
                    direction: 'dir'
                });
                expect(UserProcesses.broadcastToAllUsers).toHaveBeenCalledWith({
                    type: 'game started',
                    game: 'game started data'
                });
                done();
            });
        });

        it("Test 'join game' message (join game !returns game content)", (done) => {
            GameProcesses.joinGame.and.callFake(()=>{
                return new Promise(resolve=>{
                    setTimeout(()=>resolve(), 100);
                });
            });

            Socket.processMessage(message, userData).then(()=>{
                expect(GameProcesses.joinGame).toHaveBeenCalledWith('gn1', 'dir', userData);
                expect(UserProcesses.broadcastToAllUsers).toHaveBeenCalledWith({
                    type: 'player joined',
                    gameName: 'gn1',
                    playerName: 'un1',
                    direction: 'dir'
                });
                expect(UserProcesses.broadcastToAllUsers).not.toHaveBeenCalledWith({
                    type: 'game started',
                    game: 'game started data'
                });
                done();
            });
        });
    });
});
