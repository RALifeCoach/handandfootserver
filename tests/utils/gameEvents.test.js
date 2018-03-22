import GameEvents from '../../src/utils/gameEvents';

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
});
