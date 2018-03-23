import GameEvents from '../../src/utils/gameEvents';
import {game3Players, gameInitialized, gameInProgressDraw} from "../mocks/gameMocks";

describe('Game Events', ()=> {
    describe('GameEvents.startGame', () => {
        beforeEach(() => {
            spyOn(GameEvents, 'startHand');
        });

        test('Test starting a game', () => {
            const game = {};

            GameEvents.startGame(game);

            expect(game).toEqual({
                gameStarted: true,
                gameComplete: false,
                round: 0,
                currentPlayer: jasmine.any(Number)
            });
            expect(game.currentPlayer >= 0).toBe(true);
            expect(game.currentPlayer < 4).toBe(true);
        });

        test('Test startHand is called', () => {
            const game = {};

            GameEvents.startGame(game);

            expect(GameEvents.startHand).toHaveBeenCalledWith(game);
        });
    });

    describe('GameEvents.startHand', () => {
        let game;

        beforeEach(() => {
            game = {
                round: 0,
                currentPlayer: 3,
                players: [{}, {}, {}, {}],
                teams: [{}, {}],
                piles: null,
                discardPile: null
            };
        });

        test('Test round and currentPlayer', () => {
            GameEvents.startHand(game);

            expect(game.round).toBe(1);
            expect(game.currentPlayer).toBe(0);
        });

        test('Test teams', () => {
            GameEvents.startHand(game);

            expect(game.teams[0].melds.length).toBe(0);
            expect(game.teams[1].melds.length).toBe(0);
        });

        test('Test player hands', () => {
            GameEvents.startHand(game);

            expect(game.players[0].hands[0].cards[0]).toEqual({
                suit: jasmine.any(String),
                value: jasmine.any(Number),
                pinnedSeq: -1
            });
            expect(game.players[0].hands[0].cards[3]).toEqual({
                suit: jasmine.any(String),
                value: jasmine.any(Number),
                pinnedSeq: -1
            });
            expect(game.players[0].hands[0].cards[7]).toEqual({
                suit: jasmine.any(String),
                value: jasmine.any(Number),
                pinnedSeq: -1
            });
            expect(game.players[0].hands[0].cards[10]).toEqual({
                suit: jasmine.any(String),
                value: jasmine.any(Number),
                pinnedSeq: -1
            });
            expect(game.players[0].hands[0].cards.length).toBe(11);
            expect(game.players[0].hands[1].cards.length).toBe(11);
            expect(game.players[1].hands[0].cards.length).toBe(11);
            expect(game.players[1].hands[1].cards.length).toBe(11);
            expect(game.players[2].hands[0].cards.length).toBe(11);
            expect(game.players[2].hands[1].cards.length).toBe(11);
            expect(game.players[3].hands[0].cards.length).toBe(11);
            expect(game.players[3].hands[1].cards.length).toBe(11);
        });

        test('Test piles', () => {
            GameEvents.startHand(game);

            expect(game.piles[0].cards.length
                + game.piles[1].cards.length
                + game.piles[2].cards.length
                + game.piles[3].cards.length).toBe(6 * 54 - 4 * 22);
            expect(game.discardPile.cards.length).toBe(0);
        });
    });

    describe("joinGame", ()=>{
        let updateData;

        beforeEach(()=>{
            updateData = {
                direction: 'West',
                userData: {
                    user: {
                        name: 'name 3',
                        email: 'email3@email.com',
                        _id: 'uid3',
                        password: {
                            salt: 'salt',
                            token: 'token 3'
                        }
                    }
                }
            };
        });

        test("add a user to a game in initialized state", ()=>{
            module.game = gameInitialized.toJS();

            module.joinGame(updateData);

            expect(module.game).toEqual(
                Object.assign(gameInitialized.toJS(), {
                    "players": [
                        {
                            "connected": false, "hands": [{"cards": [], "sort": "none"}, {"cards": [], "sort": "none"}], "inHand": true
                        },
                        {
                            "connected": false, "hands": [{"cards": [], "sort": "none"}, {"cards": [], "sort": "none"}], "inHand": true
                        },
                        {
                            "connected": false, "hands": [{"cards": [], "sort": "none"}, {"cards": [], "sort": "none"}], "inHand": true
                        },
                        {
                            "connected": true,
                            "hands": [
                                {"cards": [], "sort": "none"},
                                {"cards": [], "sort": "none"}
                            ],
                            "inHand": true,
                            user: {
                                name: 'name 3',
                                email: 'email3@email.com',
                                _id: 'uid3',
                                password: {
                                    salt: 'salt',
                                    token: 'token 3'
                                }
                            }
                        }
                    ]
                })
            );
        });

        test("add a user to a game in 3 player state", ()=>{
            module.game = game3Players.toJS();

            module.joinGame(updateData);

            expect(module.game).toEqual(
                Object.assign(game3Players.toJS(), {
                    "currentPlayer": jasmine.any(Number),
                    "gameStarted": true,
                    "players": [
                        {
                            "connected": true,
                            "hands": [{"cards": jasmine.any(Object), "sort": "none"},
                                {"cards": jasmine.any(Object), "sort": "none"}],
                            "inHand": true,
                            "user": {
                                name: 'name 0',
                                email: 'email0@email.com',
                                _id: 'uid0',
                                password: {
                                    salt: 'salt',
                                    token: 'token 0'
                                }
                            }
                        },
                        {
                            "connected": true,
                            "hands": [{"cards": jasmine.any(Object), "sort": "none"},
                                {"cards": jasmine.any(Object), "sort": "none"}],
                            "inHand": true,
                            "user": {
                                name: 'name 1',
                                email: 'email1@email.com',
                                _id: 'uid1',
                                password: {
                                    salt: 'salt',
                                    token: 'token 1'
                                }
                            }
                        },
                        {
                            "connected": true,
                            "hands": [{"cards": jasmine.any(Object), "sort": "none"},
                                {"cards": jasmine.any(Object), "sort": "none"}],
                            "inHand": true,
                            "user": {
                                name: 'name 2',
                                email: 'email2@email.com',
                                _id: 'uid2',
                                password: {
                                    salt: 'salt',
                                    token: 'token 2'
                                }
                            }
                        },
                        {
                            "connected": true,
                            "hands": [{"cards": jasmine.any(Object), "sort": "none"},
                                {"cards": jasmine.any(Object), "sort": "none"}],
                            "inHand": true,
                            "user": {
                                name: 'name 3',
                                email: 'email3@email.com',
                                _id: 'uid3',
                                password: {
                                    salt: 'salt',
                                    token: 'token 3'
                                }
                            }
                        }
                    ],
                    piles: [
                        {cards: jasmine.any(Object)},
                        {cards: jasmine.any(Object)},
                        {cards: jasmine.any(Object)},
                        {cards: jasmine.any(Object)}
                    ]
                })
            );
        });
    });

    describe("drawCardPile", ()=>{
        let updateData,
            preHandLengths,
            prePileLengths,
            postHandLengths,
            postPileLengths;

        beforeEach(()=>{
            module.game = gameInProgressDraw.toJS();
            preHandLengths = module.game.players.map(player=>(
                (player.inHand ? player.hands[0] : player.hands[1]).cards.length
            ));
            prePileLengths = module.game.piles.map(pile=>pile.cards.length);
        });

        test("Error - invalid pile index", ()=>{
            updateData = {
                pileIndex: 4,
                playerIndex: 2
            };

            try {
                module.drawCardPile(updateData);
                fail('Test should have throw exception');
            } catch (err) {
                expect(err.message).toBe('Invalid pileIndex: 4');
            }
        });

        test("Error - empty", ()=>{
            updateData = {
                pileIndex: 1,
                playerIndex: 2
            };
            module.game.piles[1].cards = [];

            try {
                module.drawCardPile(updateData);
                fail('Test should have throw exception');
            } catch (err) {
                expect(err.message).toBe('No cards left in pile #2');
            }
        });

        test("Move card from pile to player.hand", ()=>{
            updateData = {
                pileIndex: 3,
                playerIndex: 2
            };

            module.drawCardPile(updateData);

            postHandLengths = module.game.players.map(player=>(
                (player.inHand ? player.hands[0] : player.hands[1]).cards.length
            ));
            postPileLengths = module.game.piles.map(pile=>pile.cards.length);
            expect(prePileLengths[updateData.pileIndex] - 1 === postPileLengths[updateData.pileIndex]).toBe(true);
            expect(preHandLengths[updateData.playerIndex] + 1 === postHandLengths[updateData.playerIndex]).toBe(true);
        });
    });
});
