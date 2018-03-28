import GameActions from '../../src/events/gameActions';
import {game3Players, gameInitialized, gameInProgressDraw} from "../mocks/gameMocks";
import * as cardMocks from '../mocks/cardMocks';
import {gameStates, playerStates} from "../../src/constants";

describe('GameActions', ()=> {
    describe("joinGame", ()=>{
        let updateData;

        beforeEach(()=>{
            updateData = {
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
        });

        test("add a user to a game in initialized state", ()=>{
            GameActions.game = gameInitialized.toJS();

            GameActions.joinGame(GameActions.game, GameActions.game.players[3], 'team', updateData);

            expect(GameActions.game).toEqual(
                Object.assign(gameInitialized.toJS(), {
                    "players": [
                        {
                            "connected": false, "hands": [
                                {"cards": [], "sort": "none"},
                                {"cards": [], "sort": "none"}],
                            cardsToDraw: 0,
                            "inHand": true, playerState: playerStates.NOT_JOINED
                        },
                        {
                            "connected": false, "hands": [
                                {"cards": [], "sort": "none"},
                                {"cards": [], "sort": "none"}],
                            cardsToDraw: 0,
                            "inHand": true, playerState: playerStates.NOT_JOINED
                        },
                        {
                            "connected": false, "hands": [
                                {"cards": [], "sort": "none"},
                                {"cards": [], "sort": "none"}],
                            cardsToDraw: 0,
                            "inHand": true, playerState: playerStates.NOT_JOINED
                        },
                        {
                            "connected": true,
                            "hands": [
                                {"cards": [], "sort": "none"},
                                {"cards": [], "sort": "none"}
                            ],
                            cardsToDraw: 0,
                            "inHand": true,
                            user: {
                                name: 'name 3',
                                email: 'email3@email.com',
                                _id: 'uid3',
                                password: {
                                    salt: 'salt',
                                    token: 'token 3'
                                }
                            },
                            playerState: playerStates.WAIT
                        }
                    ]
                })
            );
        });

        test("add a user to a game in 3 player state", ()=>{
            GameActions.game = game3Players.toJS();

            GameActions.joinGame(GameActions.game, GameActions.game.players[3], 'team', updateData);

            expect(GameActions.game.currentPlayerIndex >= 0).toEqual(true);
            expect(GameActions.game.currentPlayerIndex < 4).toEqual(true);
            expect(GameActions.game.gameState).toBe(gameStates.IN_PROGRESS);
            expect(GameActions.game.players[3]).toEqual({
                connected: true,
                discard: null,
                hands: [{"cards": jasmine.any(Object), "sort": "none"},
                    {"cards": jasmine.any(Object), "sort": "none"}],
                inHand: true,
                playerState: GameActions.game.currentPlayerIndex === 3 ? playerStates.INITIAL_DRAW : playerStates.WAIT,
                cardsToDraw: GameActions.game.currentPlayerIndex === 3 ? 2 : 0,
                user: {
                    name: 'name 3',
                    email: 'email3@email.com',
                    _id: 'uid3',
                    password: {
                        salt: 'salt',
                        token: 'token 3'
                    }
                }
            });
            expect(GameActions.game.piles[0].cards.length > 40).toBe(true);
            expect(GameActions.game.piles[0].cards.length < 80).toBe(true);
            expect(GameActions.game.piles[1].cards.length > 40).toBe(true);
            expect(GameActions.game.piles[1].cards.length < 80).toBe(true);
            expect(GameActions.game.piles[2].cards.length > 40).toBe(true);
            expect(GameActions.game.piles[2].cards.length < 80).toBe(true);
            expect(GameActions.game.piles[3].cards.length > 40).toBe(true);
            expect(GameActions.game.piles[3].cards.length < 80).toBe(true);
            expect(GameActions.game.discardPileLocked).toBe(false);
            expect(GameActions.game.discardPile.cards).toEqual([]);
        });
    });

    describe("drawFromPile", ()=>{
        let updateData,
            preHandLengths,
            prePileLengths,
            postHandLengths,
            postPileLengths;

        beforeEach(()=>{
            GameActions.game = gameInProgressDraw.toJS();
            preHandLengths = GameActions.game.players.map(player=>(
                (player.inHand ? player.hands[0] : player.hands[1]).cards.length
            ));
            prePileLengths = GameActions.game.piles.map(pile=>pile.cards.length);
        });

        test("Move card from pile to player.hand", ()=>{
            updateData = {
                pileIndex: 3
            };

            GameActions.drawFromPile(GameActions.game, GameActions.game.players[2], 'team', updateData);

            postHandLengths = GameActions.game.players.map(player=>(
                (player.inHand ? player.hands[0] : player.hands[1]).cards.length
            ));
            postPileLengths = GameActions.game.piles.map(pile=>pile.cards.length);
            expect(prePileLengths[updateData.pileIndex] - 1 === postPileLengths[updateData.pileIndex]).toBe(true);
            expect(preHandLengths[2] + 1 === postHandLengths[2]).toBe(true);
        });

        test("Set player state (still cards to draw).", ()=>{
            updateData = {
                pileIndex: 3
            };

            GameActions.drawFromPile(GameActions.game, GameActions.game.players[3], 'team', updateData);

            expect(GameActions.game.players[3].playerState).toBe(playerStates.DRAW);
        });

        test("Set player state (still cards to draw).", ()=>{
            updateData = {
                pileIndex: 3
            };
            GameActions.game.players[3].cardsToDraw = 1;

            GameActions.drawFromPile(GameActions.game, GameActions.game.players[3], 'team', updateData);

            expect(GameActions.game.players[3].playerState).toBe(playerStates.PLAY);
        });
    });

    describe("drawFromDiscard", ()=>{
        let player, game;

        beforeEach(()=>{
            player = {
                inHand: false,
                hands: [
                    {},
                    { cards: [] }
                ]
            };
            game = {
                discardPile: {
                    cards: [
                        {
                            _id: 'card1'
                        }
                    ]
                }
            };
        });

        test("Move a card from the discard pile to the hand/foot", ()=>{
            GameActions.drawFromDiscard(game, player);

            expect(player.hands[1].cards).toEqual([
                {
                    _id: 'card1',
                    selected: true
                }
            ]);
        });

        test("Set player status", ()=>{
            GameActions.drawFromDiscard(game, player);

            expect(player.playerState).toBe(playerStates.UP7_PENDING);
        });
    });

    describe("addToMeld", ()=>{
        let player, team, updateData;

        beforeEach(()=>{
            player = {
                inHand: true,
                hands: [
                    {
                        cards: [
                            {
                                _id: 'cid1'
                            },
                            {
                                _id: 'cid2'
                            },
                            {
                                _id: 'cid3'
                            }
                        ]
                    }
                ]
            };
            team = {
                melds: [
                    {
                        _id: 'mid1'
                    },
                    {
                        _id: 'mid2',
                        cards: []
                    }
                ]
            };
            updateData = {
                cards: [ {_id: 'cid1'}, {_id: 'cid3'} ],
                meldId: 'mid2'
            };
        });

        test("Move selected cards to the meld (not complete)", ()=>{
            GameActions.addToMeld('game', player, team, updateData);

            expect(team.melds[1].cards).toEqual([
                {
                    _id: 'cid1'
                },
                {
                    _id: 'cid3'
                }
            ]);
            expect(team.melds[1].isComplete).toBe(false);
            expect(player.hands[0].cards).toEqual([
                {
                    _id: 'cid2'
                }
            ]);
        });

        test("Move selected cards to the meld (complete)", ()=>{
            team.melds[1].cards = [1, 2, 3, 4, 5];

            GameActions.addToMeld('game', player, team, updateData);

            expect(team.melds[1].isComplete).toBe(true);
        });
    });

    describe("addToBoard", ()=>{
        let player, team, updateData;

        beforeEach(()=>{
            player = {
                inHand: true,
                hands: [
                    {
                        cards: [
                            {
                                _id: 'cid1'
                            },
                            {
                                _id: 'cid2'
                            },
                            {
                                _id: 'cid3'
                            }
                        ]
                    }
                ]
            };
            team = {
                melds: [
                    {
                        _id: 'mid1'
                    },
                    {
                        _id: 'mid2',
                        cards: []
                    }
                ]
            };
            updateData = {
                cards: [ Object.assign({}, cardMocks.fiveClubs, {_id: 'cid1'}),
                    Object.assign({}, cardMocks.sixClubs, {_id: 'cid3'}) ],
                meldId: 'mid2'
            };
        });

        /*
        const selectedCards = updateData.cards.sort((cardA, cardB) => cardA.value - cardB.value);
        GameUtils.createMeld(selectedCards, team);

        GameUtils.removeCardsFromHand(player, selectedCards);
         */
        test("Create meld with selected cards", ()=>{
            GameActions.addToBoard('game', player, team, updateData);

            expect(team.melds[2]).toEqual({
                "cards": [
                    {"_id": "cid1", "isRedThree": false, "isWild": false, "suit": "Club", "value": 3},
                    {"_id": "cid3", "isRedThree": false, "isWild": false, "suit": "Club", "value": 4}
                ],
                "isComplete": true,
                "isDirty": false,
                "suit": "Club",
                "type": "run"
            });
            expect(player.hands[0].cards).toEqual([
                {
                    _id: 'cid2'
                }
            ]);
        });
    });
});
