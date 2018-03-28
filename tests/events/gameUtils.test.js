import GameUtils from '../../src/events/gameUtils';
import {gameStates, meldTypes, playerStates, suits} from "../../src/constants";
import * as gameMocks from '../mocks/gameMocks';
import * as cardMocks from '../mocks/cardMocks';

describe('GameUtils', ()=> {
    describe('startGame', () => {
        beforeEach(() => {
            spyOn(GameUtils, 'startHand');
        });

        test('Test starting a game', () => {
            const game = {};

            GameUtils.startGame(game);

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

            GameUtils.startGame(game);

            expect(GameUtils.startHand).toHaveBeenCalledWith(game);
        });
    });

    describe('startHand', () => {
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
            GameUtils.startHand(game);

            expect(game.roundId).toBe(1);
            expect(game.currentPlayerIndex).toBe(0);
        });

        test('Test teams', () => {
            GameUtils.startHand(game);

            expect(game.teams[0].melds.length).toBe(0);
            expect(game.teams[1].melds.length).toBe(0);
        });

        test('Test player hands', () => {
            GameUtils.startHand(game);

            expect(game.players[0].hands[0].cards[0]).toEqual({
                suit: jasmine.any(String),
                value: jasmine.any(Number),
                isWild: jasmine.any(Boolean),
                isRedThree: jasmine.any(Boolean),
                pinnedSeq: -1
            });
            expect(game.players[0].hands[0].cards[3]).toEqual({
                suit: jasmine.any(String),
                value: jasmine.any(Number),
                isWild: jasmine.any(Boolean),
                isRedThree: jasmine.any(Boolean),
                pinnedSeq: -1
            });
            expect(game.players[0].hands[0].cards[7]).toEqual({
                suit: jasmine.any(String),
                value: jasmine.any(Number),
                isWild: jasmine.any(Boolean),
                isRedThree: jasmine.any(Boolean),
                pinnedSeq: -1
            });
            expect(game.players[0].hands[0].cards[10]).toEqual({
                suit: jasmine.any(String),
                value: jasmine.any(Number),
                isWild: jasmine.any(Boolean),
                isRedThree: jasmine.any(Boolean),
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
            GameUtils.startHand(game);

            expect(game.piles[0].cards.length
                + game.piles[1].cards.length
                + game.piles[2].cards.length
                + game.piles[3].cards.length).toBe(6 * 54 - 4 * 22);
            expect(game.discardPile.cards.length).toBe(0);
        });
    });

    describe("nextPlayer", ()=>{
        let game;

        beforeEach(()=>{
            game = {
                currentPlayerIndex: 1,
                players: [
                    {},
                    {
                        discard: 'discard',
                        playerState: null
                    },
                    {
                        discard: null,
                        playerState: null
                    },
                    {}
                ]
            };
        });

        test("Update current player", ()=>{
            const result = GameUtils.nextPlayer(game);

            expect(game.players[1]).toEqual({
                discard: null,
                playerState: playerStates.WAIT
            });
        });

        test("Update next player", ()=>{
            const result = GameUtils.nextPlayer(game);

            expect(game.currentPlayerIndex).toBe(2);
            expect(game.players[2]).toEqual({
                discard: null,
                playerState: playerStates.INITIAL_DRAW
            });
        });
    });

    describe("endHand", ()=>{
        let game;

        beforeEach(()=>{
            game = {};
            spyOn(GameUtils, 'endGame');
            spyOn(GameUtils, 'startHand');
        });

        test("End the game if in round 7", ()=>{
            game = {
                roundId: 7
            };

            const result = GameUtils.endHand(game);

            expect(GameUtils.endGame).toHaveBeenCalledWith(game);
        });

        test("Start a new hand if not in round 7", ()=>{
            game = {
                roundId: 6
            };

            const result = GameUtils.endHand(game);

            expect(GameUtils.startHand).toHaveBeenCalledWith(game);
        });
    });

    describe("endGame", ()=>{
        test("End the game if in round 7", ()=>{
            const game = {
                gameState: null
            };

            const result = GameUtils.endGame(game);

            expect(game).toEqual({
                gameState: gameStates.COMPLETED
            });
        });
    });

    /*
        if (selectedCards[0].isRedThree) {
            team.melds.push(...selectedCards.map(card=>new MeldSchema(
                {
                    type: meldTypes.RED_THREE,
                    cardValue: card.value,
                    suit: card.suit,
                    isDirty: false,
                    isComplete: true,
                    cards: [ card ]
                }
            )));
            player.playerState = playerStates.DRAW;
            player.cardsToDraw = selectedCards.length;
        }
     */
    describe("createMeld", ()=>{
        let team, player;

        beforeEach(()=>{
            team = {
                melds: []
            };
            player = {};
        });

        test("Create red three melds", ()=>{
            const selectedCards = [cardMocks.redThree, cardMocks.redThree];

            GameUtils.createMeld(selectedCards, player, team);

            expect(team.melds).toEqual([
                {
                    type: meldTypes.RED_THREE,
                    cardValue: 1,
                    suit: suits[1],
                    isDirty: false,
                    isComplete: true,
                    cards: [ cardMocks.redThree ]
                },
                {
                    type: meldTypes.RED_THREE,
                    cardValue: 1,
                    suit: suits[1],
                    isDirty: false,
                    isComplete: true,
                    cards: [ cardMocks.redThree ]
                }
            ]);
            expect(player).toEqual({
                playerState: playerStates.DRAW,
                cardsToDraw: 2
            });
        });

        test("Create dirty meld", ()=>{
            const selectedCards = [cardMocks.sixHearts, cardMocks.sixHearts, cardMocks.joker];

            GameUtils.createMeld(selectedCards, player, team);

            expect(team.melds).toEqual([
                {
                    type: meldTypes.MELD,
                    cardValue: 4,
                    isDirty: true,
                    isComplete: false,
                    cards: [ cardMocks.joker, cardMocks.sixHearts, cardMocks.sixHearts ]
                }
            ]);
            expect(player).toEqual({});
        });

        test("Create clean meld", ()=>{
            const selectedCards = [cardMocks.sixHearts, cardMocks.sixHearts, cardMocks.sixHearts];

            GameUtils.createMeld(selectedCards, player, team);

            expect(team.melds).toEqual([
                {
                    type: meldTypes.MELD,
                    cardValue: 4,
                    isDirty: false,
                    isComplete: false,
                    cards: [ cardMocks.sixHearts, cardMocks.sixHearts, cardMocks.sixHearts ]
                }
            ]);
            expect(player).toEqual({});
        });

        test("Create wild cards", ()=>{
            const selectedCards = [cardMocks.joker, cardMocks.joker, cardMocks.joker];

            GameUtils.createMeld(selectedCards, player, team);

            expect(team.melds).toEqual([
                {
                    type: meldTypes.WILD_CARDS,
                    isDirty: false,
                    isComplete: false,
                    cards: [ cardMocks.joker, cardMocks.joker, cardMocks.joker ]
                }
            ]);
            expect(player).toEqual({});
        });

        test("Create run", ()=>{
            const selectedCards = [cardMocks.sixClubs, cardMocks.sevenClubs, cardMocks.eightClubs];

            GameUtils.createMeld(selectedCards, player, team);

            expect(team.melds).toEqual([
                {
                    type: meldTypes.RUN,
                    suit: suits[0],
                    isDirty: false,
                    isComplete: false,
                    cards: [ cardMocks.sixClubs, cardMocks.sevenClubs, cardMocks.eightClubs ]
                }
            ]);
            expect(player).toEqual({});
        });
    });

    describe("removeCardsFromHand", ()=>{
        let player, selectedCards;

        beforeEach(()=>{
            player = {
                playerState: playerStates.PLAY,
                inHand: true,
                hands: [
                    {
                        cards: [
                            {
                                _id: 'cid1'
                            },
                            {
                                _id: 'cid2'
                            }
                        ]
                    }
                ]
            };
            selectedCards = [
                {
                    _id: 'cid1'
                },
                {
                    _id: 'cid2'
                }
            ];
        });

        test("remove selected cards from hand", ()=>{
            GameUtils.removeCardsFromHand(player, selectedCards);

            expect(player.hands[0].cards).toEqual([]);
        });

        test("Set inHand to false", ()=>{
            GameUtils.removeCardsFromHand(player, selectedCards);

            expect(player.inHand).toBe(false);
        });
    });

    describe("canEndHand", ()=>{
        test("return true if clean and dirty melds", ()=>{
            const team = {
                melds: [
                    {
                        type: meldTypes.MELD,
                        isComplete: true,
                        isDirty: false
                    },
                    {
                        type: meldTypes.MELD,
                        isComplete: true,
                        isDirty: true
                    }
                ]
            };

            const result = GameUtils.canEndHand(team);

            expect(result).toBe(true);
        });
    });

    describe("stripDownGame", ()=>{
        let message;

        beforeEach(()=>{
            message = {
                game: gameMocks.gameInProgressPlay.toJS()
            };
        });

        test("Set originalGame to null if no game in the message", ()=>{
            message = {};

            GameUtils.stripDownGame(message);

            expect(GameUtils.originalGame).toBe(null);
        });

        test("Set piles for transmission", ()=>{
            GameUtils.stripDownGame(message);

            expect(message.game.piles).toBe(undefined);
            expect(message.game.pileCounts).toEqual(gameMocks.gameInProgressPlay.get('piles').map(pile=>pile.cards.length));
            expect(message.game.discardPile).toBe(undefined);
            expect(message.game.discardPileCount).toBe(gameMocks.gameInProgressPlay.get('discardPile').cards.length);
            expect(message.game.discardPileTopCard).toEqual(gameMocks.gameInProgressPlay.get('discardPile').cards
                [gameMocks.gameInProgressPlay.get('discardPile').cards.length - 1]);
        });

        test("Set player hands for transmission", ()=>{
            GameUtils.stripDownGame(message);

            expect(message.game.players[0].hands).toBe(undefined);
            const player = gameMocks.gameInProgressPlay.get('players')[0];
            expect(message.game.players[0].handCount).toEqual(player.inHand
                ? player.hands[0].cards.length
                : player.hands[1].cards.length);
        });

        test("Set teams for transmission", ()=>{
            message.game.teams[0].melds = [
                {
                    isComplete: true,
                    type: meldTypes.RED_THREE
                },
                {
                    isComplete: true,
                    type: meldTypes.RUN
                },
                {
                    isComplete: true,
                    type: meldTypes.MELD,
                    isDirty: false
                },
                {
                    isComplete: true,
                    type: meldTypes.MELD,
                    isDirty: true
                },
                {
                    isComplete: true,
                    type: meldTypes.WILD_CARDS
                }
            ];
            message.game.teams[1].melds = [
                {
                    isComplete: true,
                    type: meldTypes.RED_THREE
                },
                {
                    isComplete: false,
                    type: meldTypes.RUN
                },
                {
                    isComplete: false,
                    type: meldTypes.MELD,
                    isDirty: false
                },
                {
                    isComplete: false,
                    type: meldTypes.MELD,
                    isDirty: true
                },
                {
                    isComplete: false,
                    type: meldTypes.WILD_CARDS
                }
            ];
            GameUtils.stripDownGame(message);

            expect(message.game.teams[0].scoreCurrentHand).toBe(3900);
            expect(message.game.teams[0].melds).toEqual([
                {
                    isComplete: true,
                    type: meldTypes.RED_THREE
                },
                {
                    isComplete: true,
                    type: meldTypes.RUN
                },
                {
                    isComplete: true,
                    type: meldTypes.MELD,
                    isDirty: false
                },
                {
                    isComplete: true,
                    type: meldTypes.MELD,
                    isDirty: true
                },
                {
                    isComplete: true,
                    type: meldTypes.WILD_CARDS
                }
            ]);
            expect(message.game.teams[1].scoreCurrentHand).toBe(-2900);
        });

        test("Set player hands for transmission", ()=>{
            message.game.undo = [ 1, 2, 3 ];

            GameUtils.stripDownGame(message);

            expect(message.game.undo).toBe(undefined);
            expect(message.game.undoCount).toBe(3);
        });

        test("Compare original game to starting point", ()=>{
            GameUtils.stripDownGame(message);

            expect(GameUtils.originalGame).toEqual(gameMocks.gameInProgressPlay.toJS());
        });
    });

    describe("setPlayerHands", ()=>{
        let game;
        beforeEach(()=>{
            const message = { game: gameMocks.gameInProgressPlay.toJS() };
            GameUtils.stripDownGame(message);
            game = message.game;
        });

        test("If no original game just return", ()=>{
            GameUtils.originalGame = null;

            GameUtils.setPlayerHands(game, 1);

            expect(true).toBe(true);
        });

        test("Set player hands", ()=>{
            GameUtils.setPlayerHands(game, 1);

            expect(game.players[1].hand).toEqual(gameMocks.gameInProgressPlay.get('players')[1].hands[0]);
        });
    });
});
