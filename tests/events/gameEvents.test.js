import GameEvents from '../../src/events/gameEvents';
import {game3Players, gameInitialized, gameInProgressDraw} from "../mocks/gameMocks";
import {gameStates, playerStates} from "../../src/constants";

describe('Game Events', ()=> {
    describe('GameEvents.startGame', () => {
        beforeEach(() => {
            spyOn(GameEvents, 'startHand');
        });

        test('Test starting a game', () => {
            const game = {};

            GameEvents.startGame(game);

            expect(game).toEqual({
                gameState: gameStates.IN_PROGRESS,
                roundId: 0,
                currentPlayerIndex: jasmine.any(Number)
            });
            expect(game.currentPlayerIndex >= 0).toBe(true);
            expect(game.currentPlayerIndex < 4).toBe(true);
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
                roundId: 0,
                currentPlayerIndex: 3,
                players: [{}, {}, {}, {}],
                teams: [{}, {}],
                piles: null,
                discardPile: null
            };
        });

        test('Test round and currentPlayer', () => {
            GameEvents.startHand(game);

            expect(game.roundId).toBe(1);
            expect(game.currentPlayerIndex).toBe(0);
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
            GameEvents.game = gameInitialized.toJS();

            GameEvents.joinGame(GameEvents.game, GameEvents.game.players[3], 'team', updateData);

            expect(GameEvents.game).toEqual(
                Object.assign(gameInitialized.toJS(), {
                    "players": [
                        {
                            "connected": false, "hands": [
                                {"cards": [], "sort": "none"},
                                {"cards": [], "sort": "none"}], "inHand": true, playerState: playerStates.NOT_JOINED
                        },
                        {
                            "connected": false, "hands": [{"cards": [], "sort": "none"},
                                {"cards": [], "sort": "none"}], "inHand": true, playerState: playerStates.NOT_JOINED
                        },
                        {
                            "connected": false, "hands": [{"cards": [], "sort": "none"},
                                {"cards": [], "sort": "none"}], "inHand": true, playerState: playerStates.NOT_JOINED
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
                            },
                            playerState: playerStates.WAIT
                        }
                    ]
                })
            );
        });

        test("add a user to a game in 3 player state", ()=>{
            GameEvents.game = game3Players.toJS();

            GameEvents.joinGame(GameEvents.game, GameEvents.game.players[3], 'team', updateData);

            expect(GameEvents.game.currentPlayerIndex >= 0).toEqual(true);
            expect(GameEvents.game.currentPlayerIndex < 4).toEqual(true);
            expect(GameEvents.game.gameState).toBe(gameStates.IN_PROGRESS);
            expect(GameEvents.game.players[3]).toEqual({
                connected: true,
                hands: [{"cards": jasmine.any(Object), "sort": "none"},
                    {"cards": jasmine.any(Object), "sort": "none"}],
                inHand: true,
                playerState: GameEvents.game.currentPlayerIndex === 3 ? playerStates.INITIAL_DRAW : playerStates.WAIT,
                cardsToDraw: GameEvents.game.currentPlayerIndex === 3 ? 2 : 0,
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
            expect(GameEvents.game.piles[0].cards.length > 40).toBe(true);
            expect(GameEvents.game.piles[0].cards.length < 80).toBe(true);
            expect(GameEvents.game.piles[1].cards.length > 40).toBe(true);
            expect(GameEvents.game.piles[1].cards.length < 80).toBe(true);
            expect(GameEvents.game.piles[2].cards.length > 40).toBe(true);
            expect(GameEvents.game.piles[2].cards.length < 80).toBe(true);
            expect(GameEvents.game.piles[3].cards.length > 40).toBe(true);
            expect(GameEvents.game.piles[3].cards.length < 80).toBe(true);
            expect(GameEvents.game.discardPileLocked).toBe(false);
            expect(GameEvents.game.discardPile.cards).toEqual([]);
        });
    });

    describe("drawFromPile", ()=>{
        let updateData,
            preHandLengths,
            prePileLengths,
            postHandLengths,
            postPileLengths;

        beforeEach(()=>{
            GameEvents.game = gameInProgressDraw.toJS();
            preHandLengths = GameEvents.game.players.map(player=>(
                (player.inHand ? player.hands[0] : player.hands[1]).cards.length
            ));
            prePileLengths = GameEvents.game.piles.map(pile=>pile.cards.length);
        });

        test("Move card from pile to player.hand", ()=>{
            updateData = {
                pileIndex: 3,
                playerIndex: 2
            };

            GameEvents.drawFromPile(GameEvents.game, GameEvents.game.players[2], 'team', updateData);

            postHandLengths = GameEvents.game.players.map(player=>(
                (player.inHand ? player.hands[0] : player.hands[1]).cards.length
            ));
            postPileLengths = GameEvents.game.piles.map(pile=>pile.cards.length);
            expect(prePileLengths[updateData.pileIndex] - 1 === postPileLengths[updateData.pileIndex]).toBe(true);
            expect(preHandLengths[updateData.playerIndex] + 1 === postHandLengths[updateData.playerIndex]).toBe(true);
        });
    });
});
