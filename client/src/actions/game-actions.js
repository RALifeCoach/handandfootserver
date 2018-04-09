export const UPDATE_GAME = 'update game';
export const DRAW_CARD_PILE = 'draw card pile';

export function updateGame(game) {
    return {
        type: UPDATE_GAME,
        game
    }
}

export function drawCardPile(pileIndex) {
    return {
        type: DRAW_CARD_PILE,
        pileIndex
    }
}
