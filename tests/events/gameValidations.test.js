import GameValidations from '../../src/events/gameValidations';
import {meldTypes, playerStates, suits, teamStates} from '../../src/constants';
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

    describe("addToMeld", ()=>{
        let game, player, team, updateData;

        beforeEach(()=>{
            player = {};
            game = {};
            team = {
                melds: [
                    {
                        _id: 'mid1',
                        isComplete: true
                    },
                    {
                        _id: 'mid2',
                        suit: suits[0],
                        value: 4,
                        cards: [ 1, 2, 3, 4, 5 ]
                    }
                ]
            };
            updateData = {
                cards: [ 1, 2, 3 ],
                meldId: 'mid2'
            }
        });

        test("Must pass cards", ()=>{
            updateData.cards = [];

            const result = GameValidations.addToMeld(game, player, team, updateData);

            expect(result).toBe('First select cards before adding to the table.');
        });

        test("Must find meld.", ()=>{
            updateData.meldId = 'mid3';

            const result = GameValidations.addToMeld(game, player, team, updateData);

            expect(result).toBe('Meld not found or meld is complete.');
        });

        test("Must find meld (meld complete).", ()=>{
            updateData.meldId = 'mid1';

            const result = GameValidations.addToMeld(game, player, team, updateData);

            expect(result).toBe('Meld not found or meld is complete.');
        });

        test("Too many cards to add to the meld (error when not up7 pending).", ()=>{
            player.playerState = playerStates.PLAY;

            const result = GameValidations.addToMeld(game, player, team, updateData);

            expect(result).toBe('Too many cards to add to the meld.');
        });

        test("Too many cards to add to the meld (error when up7 pending).", ()=>{
            player.playerState = playerStates.UP7_PENDING;
            updateData.cards = [ 1, 2, 3, 4, 5, 6, 7, 8 ];

            const result = GameValidations.addToMeld(game, player, team, updateData);

            expect(result).toBe('Too many selected cards.');
        });

        test("Meld type = meld - cards must all have the same value.", ()=>{
            updateData.cards = [ cardMocks.sixHearts, cardMocks.sixClubs ];
            team.melds[1].type = meldTypes.MELD;
            team.melds[1].value = 5;

            const result = GameValidations.addToMeld(game, player, team, updateData);

            expect(result).toBe('The cards must be the same value.');
        });

        test("Meld type = meld - must be more naturals than wild cards.", ()=>{
            updateData.cards = [ cardMocks.sixHearts, cardMocks.joker, cardMocks.joker ];
            team.melds[1].type = meldTypes.MELD;
            team.melds[1].value = 4;
            team.melds[1].cards = [cardMocks.sixClubs, cardMocks.sixHearts, cardMocks.joker];

            const result = GameValidations.addToMeld(game, player, team, updateData);

            expect(result).toBe('Too many wild cards.');
        });

        test("Meld type = meld - ok.", ()=>{
            updateData.cards = [ cardMocks.sixHearts, cardMocks.joker ];
            team.melds[1].type = meldTypes.MELD;
            team.melds[1].value = 4;
            team.melds[1].cards = [cardMocks.sixClubs, cardMocks.sixHearts, cardMocks.joker];

            const result = GameValidations.addToMeld(game, player, team, updateData);

            expect(result).toBe(null);
        });

        test("Meld type = wild cards - all selected cards must be wild cards.", ()=>{
            updateData.cards = [ cardMocks.sixHearts, cardMocks.joker ];
            team.melds[1].type = meldTypes.WILD_CARDS;

            const result = GameValidations.addToMeld(game, player, team, updateData);

            expect(result).toBe('The cards must be wild cards.');
        });

        test("Meld type = wild cards - okay.", ()=>{
            updateData.cards = [ cardMocks.joker ];
            team.melds[1].type = meldTypes.WILD_CARDS;

            const result = GameValidations.addToMeld(game, player, team, updateData);

            expect(result).toBe(null);
        });

        test("Meld type = run - all selected cards must not be wild cards.", ()=>{
            updateData.cards = [ cardMocks.sixHearts, cardMocks.joker ];
            team.melds[1].type = meldTypes.RUN;

            const result = GameValidations.addToMeld(game, player, team, updateData);

            expect(result).toBe('The cards must not be wild cards or 3.');
        });

        test("Meld type = run - all selected cards must not be wild cards.", ()=>{
            updateData.cards = [ cardMocks.sixHearts, cardMocks.redThree ];
            team.melds[1].type = meldTypes.RUN;

            const result = GameValidations.addToMeld(game, player, team, updateData);

            expect(result).toBe('The cards must not be wild cards or 3.');
        });

        test("Cards are in different suits.", () => {
            updateData.cards = [cardMocks.fiveClubs, cardMocks.sixHearts, cardMocks.sevenClubs];
            team.melds[1].type = meldTypes.RUN;
            team.melds[1].cards = [cardMocks.sixClubs];

            const result = GameValidations.addToMeld(game, player, team, updateData);

            expect(result).toBe('The cards must all be in the same suit.');
        });

        test("Meld type = run - selected cards must not overlap existing cards in run.", ()=>{
            updateData.cards = [ cardMocks.sixClubs, cardMocks.fiveClubs ];
            team.melds[1].type = meldTypes.RUN;
            team.melds[1].cards = [cardMocks.sixClubs];

            const result = GameValidations.addToMeld(game, player, team, updateData);

            expect(result).toBe('Overlap of meld and selected cards.');
        });

        test("Meld type = run - selected cards must not overlap existing cards in run.", ()=>{
            updateData.cards = [ cardMocks.eightClubs, cardMocks.fiveClubs ];
            team.melds[1].type = meldTypes.RUN;
            team.melds[1].cards = [cardMocks.sixClubs];

            const result = GameValidations.addToMeld(game, player, team, updateData);

            expect(result).toBe('Gap in melded cards and selected cards.');
        });

        test("Meld type = run - okay.", ()=>{
            updateData.cards = [ cardMocks.sevenClubs, cardMocks.fiveClubs ];
            team.melds[1].type = meldTypes.RUN;
            team.melds[1].cards = [cardMocks.sixClubs];

            const result = GameValidations.addToMeld(game, player, team, updateData);

            expect(result).toBe(null);
        });
    });

    describe("addToBoard", ()=> {
        let game, player, team, updateData;

        beforeEach(() => {
            player = {};
            game = {};
            team = {};
            updateData = {
                cards: [1, 2, 3]
            }
        });

        test("Must select cards.", () => {
            updateData.cards = [];

            const result = GameValidations.addToBoard(game, player, team, updateData);

            expect(result).toBe('First select cards before adding to the table.');
        });

        test("Must pass > 2 cards if not red three.", () => {
            updateData.cards = [{}, 2];

            const result = GameValidations.addToBoard(game, player, team, updateData);

            expect(result).toBe('There must be 3-7 selected cards.');
        });

        test("Must pass < 8 cards if not red three.", () => {
            updateData.cards = [{}, 2, 3, 4, 5, 6, 7, 8];

            const result = GameValidations.addToBoard(game, player, team, updateData);

            expect(result).toBe('There must be 3-7 selected cards.');
        });

        test("Cannot play red threes when drawing from discard pile.", () => {
            updateData.cards = [{isRedThree: true}, {}];
            player.playerState = playerStates.UP7_PENDING;

            const result = GameValidations.addToBoard(game, player, team, updateData);

            expect(result).toBe('Cannot select red threes when picking up from the discard pile.');
        });

        test("If first card is red three then all must be red threes.", () => {
            updateData.cards = [{isRedThree: true}, {}];

            const result = GameValidations.addToBoard(game, player, team, updateData);

            expect(result).toBe('All cards must be red 3s.');
        });

        test("Valid wild cards.", () => {
            updateData.cards = [cardMocks.joker, cardMocks.joker, cardMocks.joker];

            const result = GameValidations.addToBoard(game, player, team, updateData);

            expect(result).toBe(null);
        });

        test("Valid run cards.", () => {
            updateData.cards = [cardMocks.fiveClubs, cardMocks.sixClubs, cardMocks.sevenClubs];

            const result = GameValidations.addToBoard(game, player, team, updateData);

            expect(result).toBe(null);
        });

        test("Invalid selection of cards.", () => {
            updateData.cards = [cardMocks.fiveClubs, cardMocks.sixHearts, cardMocks.sevenClubs];

            const result = GameValidations.addToBoard(game, player, team, updateData);

            expect(result).toBe('Invalid selection of cards - cannot form a valid meld.');
        });
    });

    describe("discard", ()=> {
        let game, player, team, updateData;

        beforeEach(() => {
            player = {
                hands: [
                    {
                        cards: [1, 2]
                    },
                    {
                        cards: [1, 2]
                    }
                ]
            };
            game = {};
            team = {
                melds: [
                    {
                        isComplete: true
                    },
                    {
                        isComplete: false,
                        type: meldTypes.WILD_CARDS
                    },
                    {
                        isComplete: false,
                        type: meldTypes.MELD,
                        value: 3,
                        cards: [cardMocks.fiveClubs]
                    },
                    {
                        isComplete: false,
                        type: meldTypes.RUN,
                        suit: suits[0],
                        cards: [cardMocks.fiveClubs, cardMocks.sixClubs]
                    }
                ]
            };
            updateData = {cards: []}
        });

        test("Must select 1 card (no cards).", () => {
            updateData.cards = [];

            const result = GameValidations.discard(game, player, team, updateData);

            expect(result).toBe('Must discard 1 and only 1 card.');
        });

        test("Must select 1 card (> 1 card).", () => {
            updateData.cards = [1, 2];

            const result = GameValidations.discard(game, player, team, updateData);

            expect(result).toBe('Must discard 1 and only 1 card.');
        });

        test("Must not be red three.", () => {
            updateData.cards = [cardMocks.redThree];

            const result = GameValidations.discard(game, player, team, updateData);

            expect(result).toBe('Cannot discard red three.');
        });

        test("Black threes okay.", () => {
            updateData.cards = [cardMocks.blackThree];

            const result = GameValidations.discard(game, player, team, updateData);

            expect(result).toBe(null);
        });

        test("Wild cards okay (!lastCard).", () => {
            updateData.cards = [cardMocks.joker];

            const result = GameValidations.discard(game, player, team, updateData);

            expect(result).toBe(null);
        });

        test("Wild cards not okay (lastCard).", () => {
            player.hands[1].cards = [1];
            updateData.cards = [cardMocks.joker];

            const result = GameValidations.discard(game, player, team, updateData);

            expect(result).toBe('Cannot discard wild card when going out.');
        });

        test("Cannot be playable (meld).", () => {
            updateData.cards = [cardMocks.fiveClubs];

            const result = GameValidations.discard(game, player, team, updateData);

            expect(result).toBe('The card can be played.');
        });

        test("Cannot be playable (run bottom).", () => {
            updateData.cards = [cardMocks.fourClubs];

            const result = GameValidations.discard(game, player, team, updateData);

            expect(result).toBe('The card can be played.');
        });

        test("Cannot be playable (run bottom).", () => {
            updateData.cards = [cardMocks.sevenClubs];

            const result = GameValidations.discard(game, player, team, updateData);

            expect(result).toBe('The card can be played.');
        });

        test("Otherwise okay.", () => {
            updateData.cards = [cardMocks.eightClubs];

            const result = GameValidations.discard(game, player, team, updateData);

            expect(result).toBe(null);
        });
    });

    describe("undo", ()=>{
        test("return message there are no rows in the undo array", ()=>{
            const game = {
                undo: []
            };

            const result = GameValidations.undo(game);

            expect(result).toBe('No undo options available.');
        });

        test("return null there are rows in the undo array", ()=>{
            const game = {
                undo: [ 1, 2 ]
            };

            const result = GameValidations.undo(game);

            expect(result).toBe(null);
        });
    });
});