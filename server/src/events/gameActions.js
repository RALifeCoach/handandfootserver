import {gameStates, playerStates} from '../constants';
import GameUtils from "./gameUtils";

export default class GameActions {
    static joinGame(game, player, team, updateData) {
        Object.assign(player, {
            connected: true,
            user: updateData.user,
            playerState: playerStates.WAIT
        });

        // this player is fourth player to join
        if (!Boolean(game.players.find(player=>!player.user || !player.connected))) {
            GameUtils.startGame(game);
        }
    }

    static drawFromPile(game, player, team, updateData) {
        const pile = game.piles[updateData.pileIndex];
        const hand = player.inHand ? player.hands[0] : player.hands[1];
        const card = pile.cards.pop();
        hand.cards.push(card);
        player.cardsToDraw -= 1;
        if (!player.cardsToDraw) {
            player.playerState = playerStates.PLAY;
        } else {
            player.playerState = playerStates.DRAW;
        }
    }

    static drawFromDiscard(game, player) {
        const hand = player.inHand ? player.hands[0] : player.hands[1];
        const card = game.discardPile.cards.pop();
        card.selected = true;
        hand.cards.push(card);
        player.playerState = playerStates.UP7_PENDING;
    }

    static addToMeld(game, player, team, updateData) {
        const meld = team.melds.find(meld => meld._id === updateData.meldId);
        meld.cards.push(...updateData.cards);
        meld.cards.sort((cardA, cardB) => cardA.value - cardB.value);
        meld.isDirty = meld.isDirty || Boolean(meld.cards.find(card=>card.isWild));
        meld.isComplete = meld.cards.length === 7;

        GameUtils.removeCardsFromHand(player, updateData.cards);
    }

    static addToBoard(game, player, team, updateData) {
        const selectedCards = updateData.cards.sort((cardA, cardB) => cardA.value - cardB.value);
        GameUtils.createMeld(selectedCards, player, team);

        GameUtils.removeCardsFromHand(player, selectedCards);
    }

    static discard(game, player, team, updateData) {
        player.discard = updateData.cards[0];
        player.playerState = playerStates.DISCARD_PENDING;
    }

    static resignRequest(game, player, team, updateData) {
        game.gameState = gameStates.PENDING_RESIGN;
        const partnerIndex = (game.currentPlayerIndex + game.players.length / 2) % game.players.length;
        game.players[partnerIndex].playerState = playerStates.RESIGN_REQUEST;
    }

    static sortMelds(game, player, team, updateData) {

    }

    static sortRuns(game, player, team, updateData) {

    }

    static pinCard(game, player, team, updateData) {

    }

    static unpinCard(game, player, team, updateData) {

    }

    static undo(game) {
        Object.assign(game, game.undo.pop());
    }

    static acceptResign(game) {
        GameUtils.endGame(game);
    }

    static cancelResign(game) {
        game.gameState = gameStates.IN_PROGRESS;
        const partnerIndex = (game.currentPlayerIndex + game.players.length / 2) % game.players.length;
        game.players[partnerIndex].playerState = playerStates.WAIT;
    }

    static acceptEnd(game) {
        GameUtils.endHand(game);
    }

    static cancelEnd(game, player) {
        game.gameState = gameStates.IN_PROGRESS;
        player.playerState = playerStates.PLAY;
        player.discard = null;
        const partnerIndex = (game.currentPlayerIndex + game.players.length / 2) % game.players.length;
        game.players[partnerIndex].playerState = playerStates.WAIT;
    }

    static acceptDiscard(game, player, team) {
        if (player.hands[1].cards.length === 0 && GameUtils.canEndHand(team)) {
            game.gameState = gameStates.PENDING_END;
            const partnerIndex = (game.currentPlayerIndex + game.players.length / 2) % game.players.length;
            game.players[partnerIndex].playerState = playerStates.END_REQUEST;
        } else {
            game.discardPile.cards.push(player.discard);
            GameUtils.removeCardsFromHand(player, [player.discard]);
            GameUtils.nextPlayer(game);
        }
    }

    static cancelDiscard(game, player) {
        player.playerState = playerStates.PLAY;
        player.discard = null;
    }
}
