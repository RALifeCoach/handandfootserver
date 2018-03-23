import gameProcesses from '../../src/processes/gameProcesses';
import GameModel from '../../src/models/game';
import GameRules from '../../src/events/gameRules';
import { gameInitialized } from '../mocks/gameMocks';

describe("Game Processes", ()=> {
    const module = gameProcesses;

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

            const promise = module.createNewGame('game 2', { salt: 'salt', token: 'token' });

            expect(GameModel.create).toHaveBeenCalledWith(gameInitialized.toJS());
            promise.then(()=>{
                expect(module.game).toEqual(Object.assign(gameModel, gameInitialized.toJS()));
                done();
            });
        })
    });

    describe("updateGame", () => {
        let game0,
            game1,
            game1Saved,
            updateGame;

        beforeEach(()=>{
            game0 = {
                name: 'game0'
            };
            game1 = {
                name: 'game1',
                gameState: 'state1',
                players: [ { playerState: 'pstate1' }, 'player2', 'player3', 'player4' ],
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
            module.game = game1;
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
            spyOn(GameRules, 'validateStatesAndActions').and.returnValue('action');
            spyOn(GameRules, 'performValidationAndAction');
        });

        test("Fetch the game (game already present).", (done) =>{
            const promise = module.updateGame('game1', 0, 'action', 'updateData')
                .then(()=>{
                    expect(module.game).toBe(game1Saved);
                    done();
                })
                .catch(err=>{
                    fail(err.message);
                });
        });

        test("Fetch the game (game present, names !=).", (done) =>{
            module.game = game0;

            const promise = module.updateGame('game1', 0, 'action', 'updateData')
                .then(()=>{
                    expect(module.game).toBe(game1Saved);
                    done();
                })
                .catch(err=>{
                    fail(err.message);
                });
        });

        test("Fetch the game (game not present).", (done) =>{
            module.game = null;

            const promise = module.updateGame('game1', 0, 'action', 'updateData')
                .then(()=>{
                    expect(module.game).toBe(game1Saved);
                    done();
                })
                .catch(err=>{
                    fail(err.message);
                });
        });

        test("Fetch the game (game not found).", (done) =>{
            const promise = module.updateGame('game2', 0, 'action', 'updateData')
                .then(()=>{
                    fail('should have throw error');
                })
                .catch(err=>{
                    expect(err.message).toBe('game2 not found');
                    done();
                });
        });

        test("Error - invalid player index", (done)=>{
            const promise = module.updateGame('game1', 5, 'action', 'updateData')
                .then(()=>{
                    fail('should have throw error');
                })
                .catch(err=>{
                    expect(err.message).toBe('player not found at index 5');
                    done();
                });
        });

        test("Call GameRules", (done)=>{
            const promise = module.updateGame('game1', 0, 'actionType', 'updateData')
                .then(()=>{
                    expect(GameRules.validateStatesAndActions)
                        .toHaveBeenCalledWith('state1', 'pstate1', 'actionType', 'updateData');
                    expect(GameRules.performValidationAndAction)
                        .toHaveBeenCalledWith('action', game1, {"playerState": "pstate1"}, 'updateData');
                    done();
                })
                .catch(err=>{
                    fail('should not have throw error - ' + err.message);
                });
        });
    });

    describe("addPlayers", () => {
        beforeEach(()=>{
            module.game = {
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

            const promise = module.addPlayers({players});

            expect(module.game).toEqual({
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

        test("add 2 players to game (module.game).", () =>{
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

            const promise = module.addPlayers({players});

            expect(module.game).toEqual({
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
