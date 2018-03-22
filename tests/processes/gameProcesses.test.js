import gameProcesses from '../../src/processes/gameProcesses';
import GameModel from '../../src/models/game';

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

            expect(GameModel.create).toHaveBeenCalledWith({
                name: 'game 2',
                password: { salt: 'salt', token: 'token' },
                teams: [
                    {
                        score: 0,
                        melds: []
                    },
                    {
                        score: 0,
                        melds: []
                    }
                ],
                players: [{}, {}, {}, {}],
                round: 0,
                gameComplete: false,
                gameStarted: false,
                currentPlayer: -1,
                piles: [],
                discardPile: null,
                historySchema: []
            });
            promise.then(()=>{
                expect(module.game).toEqual({
                    "currentPlayer": -1,
                    "discardPile": null,
                    "gameComplete": false,
                    "gameStarted": false,
                    "historySchema": [],
                    "name": "game 2",
                    "password": {
                        "salt": "salt",
                        "token": "token"
                    },
                    "piles": [],
                    "players": [
                        {},
                        {},
                        {},
                        {}
                    ],
                    "round": 0,
                    "save": jasmine.any(Function),
                    "teams": [
                        {
                            "melds": [],
                            "score": 0,
                        },
                        {
                            "melds": [],
                            "score": 0,
                        }
                    ]
                });
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
                save: jasmine.createSpy().and.returnValue(new Promise(resolve=>{
                    setTimeout(()=>resolve(game1Saved), 100);
                }))
            };
            game1Saved = {
                _id: 'saved id1',
                name: 'game1',
                save: jasmine.createSpy().and.returnValue(new Promise(resolve=>{
                    setTimeout(()=>resolve(game1), 100);
                }))
            };
            spyOn(GameModel, 'findOne').and.callFake(gameName=> {
                console.log(game1);
                console.log('game1');
                return new Promise(resolve => {
                    setTimeout(() => {
                        if (gameName === 'game1') {
                            console.log(game1);
                            console.log('game1');
                            console.log('game1');
                            console.log('game1');
                            console.log('game1');
                            console.log('game1');
                            console.log('game1');
                            console.log('game1');
                            console.log('game1');
                            console.log('game1');
                            console.log('game1');
                            console.log('game1');
                            console.log('game1');
                            console.log('game1');
                            console.log('game1');
                            resolve(game1);
                        } else {
                            resolve(null);
                        }
                    }, 100);
                });
            });
        });

        test("Fetch the game (game already present).", (done) =>{
            module.game = game1;
            updateGame = updateData => {
                expect(updateData).toBe('updateData');
                expect(module.game).toEqual(game1);
            };

            const promise = module.updateGame('game1', 'updateData', updateGame)
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
            updateGame = updateData => {
                expect(updateData).toBe('updateData');
                expect(module.game).toEqual(game1);
            };

            const promise = module.updateGame('game1', 'updateData', updateData=>updateGame(updateData))
                .then(()=>{
                    expect(module.game).toBe(game1Saved);
                    done();
                })
                .catch(err=>{
                    fail(err.message);
                });
        });

    //     test("Fetch the game (game not present).", (done) =>{
    //         module.game = null;
    //         updateGame = updateData => {
    //             expect(updateData).toBe('updateData');
    //             expect(module.game).toEqual(game1);
    //         };
    //
    //         const promise = module.updateGame('game1', 'updateData', updateData=>updateGame(updateData))
    //             .then(()=>{
    //                 expect(module.game).toBe(game1Saved);
    //                 done();
    //             });
    //     });
    //
    //     test("Fetch the game (game not found).", (done) =>{
    //         module.game = null;
    //         updateGame = jasmine.createSpy();
    //
    //         const promise = module.updateGame('game1', 'updateData', updateData=>updateGame(updateData))
    //             .then(()=>{
    //                 fail('should have throw error');
    //             })
    //             .catch(err=>{
    //                 expect(err.message).toBe('game2 not found');
    //                 done();
    //             });
    //     });
    });
    //
    // describe("addPlayers", () => {
    //     let game;
    //
    //     beforeEach(()=>{
    //         game = {
    //             name: 'game0',
    //             players: [ {}, {}, {}, {} ],
    //             save: jasmine.createSpy().and.callFake(fn=>{
    //                 fn(null, module.game)
    //             })
    //         };
    //         module.game = game;
    //         spyOn(module, 'fetchGame').and.returnValue(new Promise(resolve=>setTimeout(()=>{
    //             module.game = game;
    //             resolve();
    //         }, 100)));
    //     });
    //
    //     test("add 1 player to game (module.game, name !=).", (done) =>{
    //         const players = [
    //             {
    //                 directionData: {
    //                     playerIndex: 0
    //                 },
    //                 user: 'user 1'
    //             }
    //         ];
    //
    //         const promise = module.addPlayers('game1', players);
    //
    //         expect(module.fetchGame).toHaveBeenCalledWith('game1');
    //         promise.then(()=> {
    //             expect(module.game).toEqual({
    //                 save: jasmine.any(Function),
    //                 name: 'game0',
    //                 players: [
    //                     {
    //                         user: 'user 1',
    //                         connected: false
    //                     },
    //                     {}, {}, {}
    //                 ]
    //             });
    //             done();
    //         });
    //     });
    //
    //     test("add 1 player to game (!module.game).", (done) =>{
    //         module.game = null;
    //         const players = [
    //             {
    //                 directionData: {
    //                     playerIndex: 0
    //                 },
    //                 user: 'user 1'
    //             }
    //         ];
    //
    //         const promise = module.addPlayers('game1', players);
    //
    //         expect(module.fetchGame).toHaveBeenCalledWith('game1');
    //         promise.then(()=> {
    //             expect(module.game).toEqual({
    //                 save: jasmine.any(Function),
    //                 name: 'game0',
    //                 players: [
    //                     {
    //                         user: 'user 1',
    //                         connected: false
    //                     },
    //                     {}, {}, {}
    //                 ]
    //             });
    //             done();
    //         });
    //     });
    //
    //     test("add 2 players to game (module.game).", (done) =>{
    //         const players = [
    //             {
    //                 directionData: {
    //                     playerIndex: 0
    //                 },
    //                 user: 'user 1'
    //             },
    //             {
    //                 directionData: {
    //                     playerIndex: 1
    //                 },
    //                 user: 'user 2'
    //             }
    //         ];
    //
    //         const promise = module.addPlayers('game0', players);
    //
    //         expect(module.fetchGame).not.toHaveBeenCalled();
    //         promise.then(()=> {
    //             expect(module.game).toEqual({
    //                 save: jasmine.any(Function),
    //                 name: 'game0',
    //                 players: [
    //                     {
    //                         user: 'user 1',
    //                         connected: false
    //                     },
    //                     {
    //                         user: 'user 2',
    //                         connected: false
    //                     },
    //                     {}, {}
    //                 ]
    //             });
    //             done();
    //         });
    //     });
    // });
    //
    // describe("joinGame", ()=>{
    //     beforeEach(()=>{
    //         spyOn(GameModel, 'default').and.returnValue();
    //     });
    // });
});
