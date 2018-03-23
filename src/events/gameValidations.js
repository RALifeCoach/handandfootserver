export default class GameValidations {
    static drawFromPile(game, player, updateData) {
        if (!game.piles[updateData.pileIndex]) {
            throw new Error('Invalid pileIndex: ' + updateData.pileIndex);
        }
        if (!pile.cards.length) {
            throw new Error('No cards left in pile #' + (updateData.pileIndex + 1).toString());
        }
    }

    static drawFromDiscard(game, updateData) {

    }

    static addToBoard(game, updateData) {

    }

    static discard(game, updateData) {

    }

    static pinCard(game, updateData) {

    }

    static unpinCard(game, updateData) {

    }

    static undo(game, updateData) {

    }
}
