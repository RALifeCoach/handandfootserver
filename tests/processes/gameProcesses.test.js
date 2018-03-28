import gameProcesses from '../../src/processes/gameProcesses';
import GameModel from '../../src/models/game';
import GameRules from '../../src/events/gameRules';
import { gameInitialized } from '../mocks/gameMocks';
import UserProcesses from "../../src/processes/userProcesses";

describe("Game Processes", ()=> {
    describe("createNewGame", () => {
        test("create new game and save it to the db", (done)=>{
            const gameModel = {
                save: jasmine.createSpy().and.returnValue(
                    new Promise(resolve=>setTimeout(()=>{
                        resolve(gameModel);
                    }, 100))
                )
            };
            spyOn(GameModel, 'create').and.callFake(game=>Object.assign(gameModel, game));

            const promise = gameProcesses.createNewGame('game 2', { salt: 'salt', token: 'token' });

            expect(GameModel.create).toHaveBeenCalledWith(gameInitialized.toJS());
            promise.then(()=>{
                expect(gameProcesses.game).toEqual(Object.assign(gameModel, gameInitialized.toJS()));
                done();
            });
        })
    });

    describe("updateGame", () => {
        let game0,
            game1,
            game1Saved;

        beforeEach(()=>{
            game0 = {
                name: 'game0'
            };
            game1 = {
                name: 'game1',
                gameState: 'state1',
                players: [ { playerState: 'pstate1' }, 'player2', 'player3', 'player4' ],
                teams: [ 'team1', 'team2' ],
                save: jasmine.createSpy().and.returnValue(new Promise(resolve=>{
                    setTimeout(()=>resolve(game1Saved), 100);
                }))
            };
            game1Saved = {
                _id: 'saved id1',
                name: 'game1',
                players: [ 'player1', 'player2', 'player3', 'player4' ],
                save: jasmine.createSpy().and.returnValue(new Promise(resolve=>{
                    setTimeout(()=>resolve(game1), 100);
                }))
            };
            gameProcesses.game = game1;
            spyOn(GameModel, 'findOne').and.callFake(gameName=> {
                return new Promise(resolve => {
                    setTimeout(() => {
                        if (gameName.name === 'game1') {
                            resolve(game1);
                        } else {
                            resolve(null);
                        }
                    }, 100);
                });
            });
            spyOn(GameRules, 'validateStatesAndActions').and.returnValue({action: 'action'});
            spyOn(GameRules, 'performValidationAndAction');
            spyOn(UserProcesses, 'broadcastToAllUsers');
        });

        test("Fetch the game (game already present).", (done) =>{
            const promise = gameProcesses
                .updateGame({gameName: 'game1', direction: 'North', type: 'action', updateData: 'updateData'})
                .then(()=>{
                    expect(gameProcesses.game).toBe(game1Saved);
                    done();
                })
                .catch(err=>{
                    fail(err.message);
                });
        });

        test("Fetch the game (game present, names !=).", (done) =>{
            gameProcesses.game = game0;

            const promise = gameProcesses
                .updateGame({gameName: 'game1', direction: 'North', type: 'action', updateData: 'updateData'})
                .then(()=>{
                    expect(gameProcesses.game).toBe(game1Saved);
                    done();
                })
                .catch(err=>{
                    fail(err.message);
                });
        });

        test("Fetch the game (game not present).", (done) =>{
            gameProcesses.game = null;

            const promise = gameProcesses
                .updateGame({gameName: 'game1', direction: 'North', type: 'action', updateData: 'updateData'})
                .then(()=>{
                    expect(gameProcesses.game).toBe(game1Saved);
                    done();
                })
                .catch(err=>{
                    fail(err.message);
                });
        });

        test("Fetch the game (game not found).", (done) =>{
            const promise = gameProcesses
                .updateGame({gameName: 'game2', direction: 'North', type: 'action', updateData: 'updateData'})
                .then(()=>{
                    fail('should have throw error');
                })
                .catch(err=>{
                    expect(err.message).toBe('game2 not found');
                    done();
                });
        });

        test("Error - invalid player index", (done)=>{
            const promise = gameProcesses
                .updateGame({gameName: 'game1', direction: 'xxxxx', type: 'action', updateData: 'updateData'})
                .then(()=>{
                    fail('should have throw error');
                })
                .catch(err=>{
                    expect(err.message).toBe('player not found at direction xxxxx');
                    done();
                });
        });

        test("Call GameRules", (done)=>{
            const promise = gameProcesses
                .updateGame({gameName: 'game1', direction: 'North', type: 'actionType', updateData: 'updateData'})
                .then(()=>{
                    expect(GameRules.validateStatesAndActions)
                        .toHaveBeenCalledWith('state1', 'pstate1', 'actionType', 'updateData');
                    expect(GameRules.performValidationAndAction)
                        .toHaveBeenCalledWith('action', game1, {"playerState": "pstate1"}, 'team1', 'updateData');
                    done();
                })
                .catch(err=>{
                    fail('should not have throw error - ' + err.message);
                });
        });
    });

    describe("addPlayers", () => {
        beforeEach(()=>{
            gameProcesses.game = {
                name: 'game0',
                players: [ {}, {}, {}, {} ]
            };
        });

        test("add 1 player to game.", () =>{
            const players = [
                {
                    directionData: {
                        playerIndex: 0
                    },
                    user: 'user 1'
                }
            ];

            const promise = gameProcesses.addPlayers({players});

            expect(gameProcesses.game).toEqual({
                name: 'game0',
                players: [
                    {
                        user: 'user 1',
                        connected: false
                    },
                    {}, {}, {}
                ]
            });
        });

        test("add 2 players to game (gameProcesses.game).", () =>{
            const players = [
                {
                    directionData: {
                        playerIndex: 0
                    },
                    user: 'user 1'
                },
                {
                    directionData: {
                        playerIndex: 1
                    },
                    user: 'user 2'
                }
            ];

            const promise = gameProcesses.addPlayers({players});

            expect(gameProcesses.game).toEqual({
                name: 'game0',
                players: [
                    {
                        user: 'user 1',
                        connected: false
                    },
                    {
                        user: 'user 2',
                        connected: false
                    },
                    {}, {}
                ]
            });
        });
    });
});
