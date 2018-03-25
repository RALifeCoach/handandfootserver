import {teamStates, suits, meldTypes} from '../constants';

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
            if (meld.cards.length + updateData.cards.length > 7) {
                return 'Too many cards to add to the meld.';
            }
        } catch (err) {
            return err.message;
        }
        return this.validateMeld(meld, updateData);
    }

    validateMeld(meld, updateData) {
        const cards = updateData.cards.sort((cardA, cardB) => cardA.value - cardB.value);
        // 2. meld is type meld
        if (meld.type === meldTypes.MELD) {
            // 2a. cards must be the same value as the meld (or wild)
            if (cards.find(card => !card.isWild && card.value !== meld.value)) {
                return 'The cards must be the same value.';
            }
            // 2b. cards must be the same value as the meld (or joker)
            const wildsInMeld = meld.cards.filter(card => card.isWild).length;
            const wildsInCards = cards.filter(card => card.isWild).length;
            if (wildsInMeld + wildsInCards > Math.floor(meld.cards.length + updateData.cards.length / 2)) {
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
            const originMeld = meld.cards.reduce((cards, card)=>Object.assign(cards, {
                [card.value]: true
            }), {});
            let errorFound = false;
            // 4b. look for overlap
            const fullMeld = cards.forEach((cards, card)=>{
                if (cards[card.value]) {
                    errorFound = true;
                }
                Object.assign(cards, {
                    [card.value]: true
                });
            }, originMeld);
            if (errorFound) {
                return 'Overlap of meld and selected cards.';
            }
            // 4b. look for a gap
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
        // 1. update data must be valid and contain 3-7 cards
        try {
            if (!updateData.cards[0].isRedThree && updateData.cards.length >= 3 && updateData.cards.length <= 7) {
                return 'First select exactly 2 cards before picking up from the pile.';
            }
        } catch (err) {
            return err.message;
        }
        // red threes
        if (updateData.cards[0].isRedThree) {
            if (updateData.cards.find(card=>!card.isRedThree)) {
                return 'All cards must be red 3s.';
            }
            return null;
        }
        // try meld
        if (!this.validateMeld({type: meldTypes.MELD, value: updateData.cards[0].value}, updateData)) {
            return null;
        }
        // try wild cards
        if (!this.validateMeld({type: meldTypes.WILD_CARDS}, updateData)) {
            return null;
        }
        // try run
        if (!this.validateMeld({type: meldTypes.RUN}, updateData)) {
            return null;
        }
        return 'Invalid selection of cards - cannot form a valid meld.';
    }

    static discard(game, player, team, updateData) {

    }

    static pinCard(game, player, team, updateData) {

    }

    static unpinCard(game, player, team, updateData) {

    }

    static undo(game, player, team, updateData) {
        if (game.undo.length === 0) {
            return 'No undo options available.';
        }
    }
}
