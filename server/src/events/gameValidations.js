import {teamStates, meldTypes, playerStates} from '../constants';
import GameUtils from './gameUtils';
import {Range} from 'immutable';

export default class GameValidations {
    static drawFromPile(game, player, team, updateData) {
        if (!game.piles[updateData.pileIndex]) {
            return 'Invalid pileIndex: ' + updateData.pileIndex;
        }
        if (!game.piles[updateData.pileIndex].cards.length) {
            return 'No cards left in pile #' + (updateData.pileIndex + 1).toString();
        }
        return null;
    }

    static drawFromDiscard(game, player, team, updateData) {
        // 1. updateData must be valid and contain 2 cards
        try {
            if (updateData.cards.length !== 2) {
                return 'First select exactly 2 cards before picking up from the pile.';
            }
        } catch (err) {
            return err.message;
        }
        const cards = updateData.cards.sort((cardA, cardB)=>cardA.value - cardB.value);
        // 2. must be cards on the discard pile
        if (!game.discardPile.cards.length) {
            return 'No cards in discard pile.';
        }
        const topCard = game.discardPile.cards[game.discardPile.cards.length - 1];
        // 3. top card must not be a 3 or wild card
        if (topCard.isWild || topCard.value === 1) {
            return 'Cannot draw wild card or 3.';
        }
        // 4. selected cards cannot both be wild
        if (cards[0].isWild && cards[1].isWild) {
            return 'Cannot select 2 wild cards.';
        }
        // 5. selected cards are 2 of the same value as the topCard
        if (cards[0].value === topCard.value && cards[1].value === topCard.value) {
            return null;
        }
        // 6. if selected cards are 1 of the same value as the topCard and a wild card then must not be locked
        if (cards[0].isWild && cards[1].value === topCard.value) {
            if (team.teamState === teamStates.NOT_ON_TABLE || game.discardPileLocked) {
                return 'Not valid cards for pickup.';
            }
            return null;
        }
        // 7. cards must now be in the same suit as the pick up card
        const topCardSuit = topCard.suit;
        if (cards[0].suit !== cards[1].suit || cards[0].suit !== topCardSuit) {
            return 'Not valid cards for pickup.';
        }
        // 8. selected cards appropriate to pick up card for a run
        // 8a. two cards above
        if (cards[0].value === topCard.value + 1 && cards[1].value === topCard.value + 2) {
            return null;
        }
        // 8b. two cards below
        if (cards[0].value === topCard.value - 2 && cards[1].value === topCard.value - 1) {
            return null;
        }
        // 8c. one above and one below
        if (cards[0].value === topCard.value - 1 && cards[1].value === topCard.value + 1) {
            return null;
        }
        // 9. invalid
        return 'Not valid cards for pickup.';
    }

    static addToMeld(game, player, team, updateData) {
        // 1. update data must be valid and contain 1-? cards
        let meld = null;
        try {
            if (updateData.cards.length === 0) {
                return 'First select cards before adding to the table.';
            }
            meld = team.melds.find(meld => meld._id === updateData.meldId);
            if (!meld || meld.isComplete) {
                return 'Meld not found or meld is complete.';
            }
            if (player.playerState === playerStates.UP7_PENDING) {
                if (updateData.cards.length > 7) {
                    return 'Too many selected cards.';
                }
            } else {
                if (meld.cards.length + updateData.cards.length > 7) {
                    return 'Too many cards to add to the meld.';
                }
            }
        } catch (err) {
            return err.message;
        }
        return GameValidations.validateMeld(meld, updateData.cards);
    }

    static validateMeld(meld, updateData) {
        const cards = updateData.sort((cardA, cardB) => cardA.value - cardB.value);
        // 2. meld is type meld
        if (meld.type === meldTypes.MELD) {
            // 2a. cards must be the same value as the meld (or wild)
            if (cards.find(card => !card.isWild && card.value !== meld.value)) {
                return 'The cards must be the same value.';
            }
            // 2b. there must be more naturals than wild cards
            const wildsInMeld = meld.cards.filter(card => card.isWild).length;
            const wildsInCards = cards.filter(card => card.isWild).length;
            if (wildsInMeld + wildsInCards
                >= meld.cards.length + updateData.length - wildsInMeld - wildsInCards) {
                return 'Too many wild cards.';
            }
            return null;
        }
        // 3. meld is wild cards meld
        if (meld.type === meldTypes.WILD_CARDS) {
            // 3a. cards must be wild
            if (cards.find(card=>!card.isWild)) {
                return 'The cards must be wild cards.';
            }
            return null;
        }
        // 4. meld is run
        if (meld.type === meldTypes.RUN) {
            // 4a. cards must not be wild or 3
            if (cards.find(card=>card.isWild || card.value === 1)) {
                return 'The cards must not be wild cards or 3.';
            }
            // 4b. cards must all be the same suit
            if (cards.find(card=>card.suit !== meld.suit)) {
                return 'The cards must all be in the same suit.';
            }
            const originMeld = meld.cards.reduce((cards, card)=>Object.assign(cards, {
                [card.value]: true
            }), {});
            let errorFound = false;
            // 4c. look for overlap
            const fullMeld = cards.reduce((fullMeldCards, card)=>{
                if (fullMeldCards[card.value]) {
                    errorFound = true;
                }
                return Object.assign(fullMeldCards, {
                    [card.value]: true
                });
            }, originMeld);
            if (errorFound) {
                return 'Overlap of meld and selected cards.';
            }
            // 4d. look for a gap
            let started = false;
            let ended = false;
            Range(2, 13).forEach(cardValue=>{
                if (!started) {
                    if (fullMeld[cardValue]) {
                        started = true;
                    }
                } else if (!ended) {
                    if (!fullMeld[cardValue]) {
                        ended = true;
                    }
                } else {
                    if (fullMeld[cardValue]) {
                        errorFound = true;
                    }
                }
            });
            return errorFound ? 'Gap in melded cards and selected cards.' : null;
        }
    }

    static addToBoard(game, player, team, updateData) {
        // 1. update data must be valid and be redThrees or contain 3-7 cards
        try {
            if (updateData.cards.length === 0) {
                return 'First select cards before adding to the table.';
            }
            if (!updateData.cards[0].isRedThree && (updateData.cards.length < 3 || updateData.cards.length > 7)) {
                return 'There must be 3-7 selected cards.';
            }
        } catch (err) {
            return err.message;
        }
        // red threes
        if (updateData.cards[0].isRedThree) {
            if (player.playerState === playerStates.UP7_PENDING) {
                return 'Cannot select red threes when picking up from the discard pile.';
            }
            if (updateData.cards.find(card=>!card.isRedThree)) {
                return 'All cards must be red 3s.';
            }
            return null;
        }
        // try meld
        if (!GameValidations.validateMeld({
                type: meldTypes.MELD,
                value: updateData.cards[0].value,
                cards: []
            }, updateData.cards)) {
            return null;
        }
        // try wild cards
        if (updateData.cards[0].isWild) {
            if (!GameValidations.validateMeld({
                    type: meldTypes.WILD_CARDS
                }, updateData.cards)) {
                return null;
            }
        }
        // try run
        if (!GameValidations.validateMeld({
                type: meldTypes.RUN,
                cards: [],
                suit: updateData.cards[0].suit
            }, updateData.cards)) {
            return null;
        }
        // black threes - only if canEndHand and 1 additional card that is discardable
        if (updateData.cards[0].value === 1) {
            // must be all black threes
            if (updateData.cards.find(card=>card.value !== 1)) {
                return 'A black 3 meld must have only black threes.';
            }
            // must be in foot and have clean and dirty complete melds
            if (player.inHand || !GameUtils.canEndHand(team)) {
                return 'A black 3 meld can only be played as you are going out.';
            }
            // must be one card remaining after playing black threes
            if (player.hands[1].length !== updateData.cards.length + 1) {
                return 'A black 3 meld can only be played as you are going out.';
            }
            // must be a discardable card
            const discard = player.hands[1].cards.find(card=>card.value !== 1);
            if (!discard || GameValidations.checkIfCardIsNotDiscardable(discard, true, team)) {
                return 'The remaining card cannot be used as a final discard.';
            }
            return null;
        }
        return 'Invalid selection of cards - cannot form a valid meld.';
    }

    static discard(game, player, team, updateData) {
        // 1. must be one card
        try {
            if (updateData.cards.length !== 1) {
                return 'Must discard 1 and only 1 card.'
            }
        } catch (err) {
            return err.message;
        }
        return GameValidations.checkIfCardIsNotDiscardable(updateData.cards[0], player.hands[1].cards.length === 1, team);
    }

    static checkIfCardIsNotDiscardable(discard, lastCard, team) {
        // 2. it cannot be a red three
        if (discard.isRedThree) {
            return 'Cannot discard red three.';
        }
        // 3. if the card is the last card in the foot then cannot be wild card
        if (lastCard) {
            if (discard.isWild) {
                return 'Cannot discard wild card when going out.';
            }
        }
        // 4. if black 3 or wild card then ok
        if (discard.value === 1 || discard.isWild) {
            return null;
        }
        // 5. it cannot be playable
        return team.melds.find(meld=>GameValidations.isDiscardPlayable(meld, discard))
            ? 'The card can be played.'
            : null;
    }

    static isDiscardPlayable(meld, discard) {
        if (meld.isComplete || meld.type === meldTypes.WILD_CARDS) {
            return false;
        }
        // 5. meld type - meld - cannot have the same value
        if (meld.type === meldTypes.MELD) {
            if (discard.value === meld.value) {
                return true;
            }
            return false;
        }
        // 6. meld type - run - cannot be the card at top or bottom
        if (meld.type === meldTypes.RUN && discard.suit === meld.suit) {
            if (discard.value === Math.min(...meld.cards.map(card=>card.value)) - 1) {
                return true;
            }
            if (discard.value === Math.max(...meld.cards.map(card=>card.value)) + 1) {
                return true;
            }
        }
        return false;
    }

    static pinCard(game, player, team, updateData) {

    }

    static unpinCard(game, player, team, updateData) {

    }

    static undo(game) {
        if (game.undo.length === 0) {
            return 'No undo options available.';
        }
        return null;
    }
}
