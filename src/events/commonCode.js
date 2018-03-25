import { Range } from 'immutable';
import { suits } from '../constants';

export const analyzeHand = player => {
    const hand = player.inHand ? player.hands[0] : player.hands[0];
    const cardValues = Range(2, 14).reduce((values, cardValue)=>
        Object.assign(values, {[cardValue]: hand.cards.filter(card=>card.value === cardValue).length}, {}));
    const cardsBySuit = suits
        .reduce((suits, suit)=>
            Object.assign(suits, {
                [suit]: Range(2, 13)
                    .reduce((values, cardValue) =>
                        Object.assign(values, {
                            [cardValue]: Boolean(hand.cards.find(card => card.suit === suit && card.value === cardValue))
                        }), {}
                    )
            })
        );
    const wildCardCount = hand.cards.filter(card=>card.isWild).length;
    return {
        hand,
        cardValues,
        cardsBySuit,
        wildCardCount
    }
};
