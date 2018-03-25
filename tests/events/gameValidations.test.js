import GameValidations from '../../src/events/gameValidations';
import {playerStates, suits, teamStates} from '../../src/constants';
import * as cardMocks from "../mocks/cardMocks";

describe('GameValidations', ()=>{
    describe('drawFromPile', ()=>{
        let game;

        beforeEach(()=>{
            game = {
                piles: [ {cards: []}, {cards: [1, 2]} ]
            };
        });

        test('Error on invalid pile index', ()=>{
            const err = GameValidations.drawFromPile(game, 'player', 'team', { pileIndex: 22});
            expect(err).toBe('Invalid pileIndex: 22');
        });

        test('Error on pile has no cards', ()=>{
            const err = GameValidations.drawFromPile(game, 'player', 'team', { pileIndex: 0});
            expect(err).toBe('No cards left in pile #1');
        });

        test('Pass validations', ()=>{
            const err = GameValidations.drawFromPile(game, 'player', 'team', { pileIndex: 1});
            expect(err).toBe(null);
        });
    });

    describe('drawFromDiscard',()=>{
        let game, player, team, updateData;

        beforeEach(()=>{
            player = {
                playerState: playerStates.DRAW
            };
            game = {
                discardPile: {
                    cards: []
                }
            };
            team = {
                teamState: teamStates.ON_TABLE,
                melds: []
            };
            updateData = {
                cards: []
            }
        });

        test('Fail if not 2 cards in updateData', ()=>{
            updateData.cards = [];

            const result = GameValidations.drawFromDiscard(game, player, team, updateData);
            
            expect(result).toBe('First select exactly 2 cards before picking up from the pile.');
        });

        test('Fail if no cards in discard pile', ()=>{
            updateData.cards = [cardMocks.sixHearts, cardMocks.sixClubs];
            game.discardPile.cards = [];

            const result = GameValidations.drawFromDiscard(game, player, team, updateData);
            
            expect(result).toBe('No cards in discard pile.');
        });

        test('Fail if top card is wild.', ()=>{
            updateData.cards = [cardMocks.sixHearts, cardMocks.sixClubs];
            game.discardPile.cards.push(cardMocks.joker);

            const result = GameValidations.drawFromDiscard(game, player, team, updateData);

            expect(result).toBe('Cannot draw wild card or 3.');
        });

        test('Fail if top card is a three.', ()=>{
            updateData.cards = [cardMocks.sixHearts, cardMocks.sixClubs];
            game.discardPile.cards.push(cardMocks.redThree);

            const result = GameValidations.drawFromDiscard(game, player, team, updateData);

            expect(result).toBe('Cannot draw wild card or 3.');
        });

        test('Fail if selected cards are both wild.', ()=>{
            updateData.cards = [cardMocks.joker, cardMocks.joker];
            game.discardPile.cards.push(cardMocks.sixClubs);

            const result = GameValidations.drawFromDiscard(game, player, team, updateData);

            expect(result).toBe('Cannot select 2 wild cards.');
        });

        test('Succeed if there are 2 matching cards.', ()=>{
            updateData.cards = [cardMocks.sixHearts, cardMocks.sixClubs];
            game.discardPile.cards.push(cardMocks.sixClubs);

            const result = GameValidations.drawFromDiscard(game, player, team, updateData);

            expect(result).toBe(null);
        });

        test('Fail if wild card present and pile locked.', ()=>{
            updateData.cards = [cardMocks.joker, cardMocks.sixClubs];
            game.discardPile.cards.push(cardMocks.sixClubs);
            team.teamState = teamStates.NOT_ON_TABLE;

            const result = GameValidations.drawFromDiscard(game, player, team, updateData);

            expect(result).toBe('Not valid cards for pickup.');
        });

        test('Fail if wild card present and pile locked.', ()=>{
            updateData.cards = [cardMocks.joker, cardMocks.sixClubs];
            game.discardPile.cards.push(cardMocks.sixClubs);
            team.teamState = teamStates.NOT_ON_TABLE;

            const result = GameValidations.drawFromDiscard(game, player, team, updateData);

            expect(result).toBe('Not valid cards for pickup.');
        });

        test('Succeed if there is 1 matching card and at least one wild card.', ()=>{
            updateData.cards = [cardMocks.joker, cardMocks.sixClubs];
            game.discardPile.cards.push(cardMocks.sixClubs);

            const result = GameValidations.drawFromDiscard(game, player, team, updateData);

            expect(result).toBe(null);
        });

        test('Fail if the selected cards are not in the same suit.', ()=>{
            updateData.cards = [cardMocks.sixHearts, cardMocks.sevenClubs];
            game.discardPile.cards.push(cardMocks.sixClubs);

            const result = GameValidations.drawFromDiscard(game, player, team, updateData);

            expect(result).toBe('Not valid cards for pickup.');
        });

        test('Succeed if there are 2 cards immediately above the top card (run).', ()=>{
            updateData.cards = [cardMocks.sevenClubs, cardMocks.eightClubs];
            game.discardPile.cards.push(cardMocks.sixClubs);

            const result = GameValidations.drawFromDiscard(game, player, team, updateData);

            expect(result).toBe(null);
        });

        test('Succeed if there are 2 cards immediately below the top card (run).', ()=>{
            updateData.cards = [cardMocks.fiveClubs, cardMocks.fourClubs];
            game.discardPile.cards.push(cardMocks.sixClubs);

            const result = GameValidations.drawFromDiscard(game, player, team, updateData);

            expect(result).toBe(null);
        });

        test('Succeed if there is 1 cards immediately below the top card and 1 immediately below (run).', ()=>{
            updateData.cards = [cardMocks.fiveClubs, cardMocks.sevenClubs];
            game.discardPile.cards.push(cardMocks.sixClubs);

            const result = GameValidations.drawFromDiscard(game, player, team, updateData);

            expect(result).toBe(null);
        });

        test('Otherwise fail.', ()=>{
            updateData.cards = [cardMocks.fiveClubs, cardMocks.eightClubs];
            game.discardPile.cards.push(cardMocks.sixClubs);

            const result = GameValidations.drawFromDiscard(game, player, team, updateData);

            expect(result).toBe('Not valid cards for pickup.');
        });
    });
});