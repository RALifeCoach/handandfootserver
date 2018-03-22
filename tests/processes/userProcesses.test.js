import userProcesses from '../../src/processes/userProcesses';
import { directions } from '../../src/constants';
import { Range } from 'immutable';
import { gameInProgress } from '../mocks/gameMocks';

describe("User Processes", ()=>{
    const module = userProcesses;
    const sort = [ 'melds', 'runs', 'none' ];

    describe("broadcastToAllUsers", ()=>{
        let game;

        beforeEach(()=>{
            game = gameInProgress.toJS();
            module.users = directions.reduce((users, direction, directionIndex)=>Object.assign(users,
                {
                    [game.players[directionIndex].user.password.token]: {
                        userData: game.players[directionIndex],
                        socket: {
                            send: jasmine.createSpy()
                        }
                    }
                }), {});
        });

        test("Broadcast to all users (game not included)", ()=>{
            const message = {
                type: 'test',
                message: 'test message'
            };

            module.broadcastToAllUsers(message);

            expect(module.users['token 0'].socket.send).toHaveBeenCalledWith(JSON.stringify(message));
            expect(module.users['token 1'].socket.send).toHaveBeenCalledWith(JSON.stringify(message));
            expect(module.users['token 2'].socket.send).toHaveBeenCalledWith(JSON.stringify(message));
            expect(module.users['token 3'].socket.send).toHaveBeenCalledWith(JSON.stringify(message));
        });

        test("Broadcast to all users (game included)", ()=>{
            const message = {
                type: 'test',
                message: 'test message',
                game
            };

            module.broadcastToAllUsers(message);

            const calls = [
                JSON.parse(module.users['token 0'].socket.send.calls.first().args[0]),
                JSON.parse(module.users['token 1'].socket.send.calls.first().args[0]),
                JSON.parse(module.users['token 2'].socket.send.calls.first().args[0]),
                JSON.parse(module.users['token 3'].socket.send.calls.first().args[0])
            ];
            expect(calls[0].type).toBe('test');
            expect(calls[0].message).toBe('test message');
            expect(calls[0].game.name).toBe('test game 1');

            expect(calls[0].game.players[0].hand.cards.length > 0).toBe(true);
            expect(calls[0].game.players[1].hand).toBe(undefined);
            expect(calls[0].game.players[2].hand).toBe(undefined);
            expect(calls[0].game.players[3].hand).toBe(undefined);
            expect(calls[1].game.players[1].hand.cards.length > 0).toBe(true);
            expect(calls[1].game.players[0].hand).toBe(undefined);
            expect(calls[1].game.players[2].hand).toBe(undefined);
            expect(calls[1].game.players[3].hand).toBe(undefined);
            expect(calls[2].game.players[2].hand.cards.length > 0).toBe(true);
            expect(calls[2].game.players[0].hand).toBe(undefined);
            expect(calls[2].game.players[1].hand).toBe(undefined);
            expect(calls[2].game.players[3].hand).toBe(undefined);
            expect(calls[3].game.players[3].hand.cards.length > 0).toBe(true);
            expect(calls[3].game.players[0].hand).toBe(undefined);
            expect(calls[3].game.players[1].hand).toBe(undefined);
            expect(calls[3].game.players[2].hand).toBe(undefined);
        });
    });
});