import { Range } from 'immutable';
import {directions, suits} from '../constants';

export default class GameEvents {
    static startGame(game) {
        game.gameStarted = true;
        game.gameComplete = false;
        // these values will be incremented in startHand
        game.roundId = 0;
        game.currentPlayer = Math.floor(Math.random() * Math.floor(4));

        GameEvents.startHand(game);
    }

    static startHand(game) {
        game.roundId += 1;
        game.currentPlayer = (game.currentPlayer + 1) % 4;
        game.currentPlayerState = 'draw';
        game.teams.forEach(team=>{
            team.melds = [];
        });

        Range(0, 4).forEach(playerIndex=>{
            game.players[playerIndex].hands = [ { cards: [], sort: 'none' }, { cards: [], sort: 'none' } ];
        });

        let allCards = Range(0, 6 * 54).map(cardIndex=>(
            {
                suit: suits[Math.floor((cardIndex % 54) / 13)],
                value: cardIndex % 54 % 13,
                pinnedSeq: -1
            }
        )).toList();

        game.piles = [ { cards: [] }, { cards: [] }, { cards: [] }, { cards: [] } ];
        Range(0, 6 * 54 - 4 * 22).forEach(()=>{
            const pileIndex = Math.floor(Math.random() * Math.floor(4));
            const cardIndex = Math.floor(Math.random() * Math.floor(allCards.size));
            game.piles[pileIndex].cards.push(allCards.get(cardIndex));
            allCards = allCards.deleteIn([cardIndex]);
        });

        Range(0, 4 * 22).forEach(cardCounter=>{
            const cardIndex = Math.floor(Math.random() * Math.floor(allCards.size));
            game.players[Math.floor(cardCounter % 8 / 2)].hands[cardCounter % 2].cards.push(allCards.get(cardIndex));
            allCards = allCards.deleteIn([cardIndex]);
        });

        game.discardPile = { cards: [] };
    }

    static joinGame(game, player, updateData) {
        Object.assign(player, {
            connected: true,
            user: updateData.user
        });

        // this player is fourth player to join
        if (!Boolean(game.players.find(player=>!player.user || !player.connected))) {
            GameEvents.startGame(game);
        }
    }

    static drawFromPile(game, player, updateData) {
        const pile = game.piles[updateData.pileIndex];
        const hand = player.inHand ? player.hands[0] : player.hands[1];
        const card = pile.cards.pop();
        hand.cards.push(card);
    }

    static drawFromDiscard(game, updateData) {

    }

    static addToBoard(game, updateData) {

    }

    static discard(game, updateData) {

    }

    static resignRequest(game, updateData) {

    }

    static sortMelds(game, updateData) {

    }

    static sortRuns(game, updateData) {

    }

    static pinCard(game, updateData) {

    }

    static unpinCard(game, updateData) {

    }

    static undo(game, updateData) {

    }

    static acceptResign(game, updateData) {

    }

    static cancelResign(game, updateData) {

    }

    static acceptEnd(game, updateData) {

    }

    static cancelEnd(game, updateData) {

    }

    static acceptDiscard(game, updateData) {

    }

    static cancelDiscard(game, updateData) {

    }
}
