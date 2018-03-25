import { Range } from 'immutable';
import {directions, gameStates, playerStates, suits, teamStates} from '../constants';

export default class GameEvents {
    static startGame(game) {
        game.gameState = gameStates.IN_PROGRESS;
        // these values will be incremented in startHand
        game.roundId = 0;
        game.currentPlayerIndex = Math.floor(Math.random() * Math.floor(4));

        GameEvents.startHand(game);
    }

    static startHand(game) {
        game.roundId += 1;
        game.currentPlayerIndex = (game.currentPlayerIndex + 1) % 4;
        game.teams.forEach(team=>{
            team.melds = [];
            team.teamState = teamStates.NOT_ON_TABLE;
        });

        game.players.forEach((player, playerIndex)=>{
            player.hands = [ { cards: [], sort: 'none' }, { cards: [], sort: 'none' } ];
            player.playerState =
                game.currentPlayerIndex === playerIndex ? playerStates.INITIAL_DRAW : playerStates.WAIT;
            player.cardsToDraw = game.currentPlayerIndex === playerIndex ? 2 : 0;
        });
        game.piles = [ { cards: [] }, { cards: [] }, { cards: [] }, { cards: [] } ];

        let allCards = Range(0, 6 * 54).map(cardIndex=> {
            const suit = suits[Math.floor((cardIndex % 54) / 13)];
            const value = suit === 4 ? -1 : cardIndex % 54 % 13;
            return {
                suit,
                value,
                pinnedSeq: -1,
                isWild: suit === 4 || value === 0,
                isRedThree: (suit === 1 || suit === 2) && value === 2
            };
        }).toList();

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

        game.discardPileLocked = false;
        game.discardPile = { cards: [] };
    }

    static joinGame(game, player, team, updateData) {
        Object.assign(player, {
            connected: true,
            user: updateData.user,
            playerState: playerStates.WAIT
        });

        // this player is fourth player to join
        if (!Boolean(game.players.find(player=>!player.user || !player.connected))) {
            GameEvents.startGame(game);
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

    static drawFromDiscard(game, player, team, updateData) {
        const hand = player.inHand ? player.hands[0] : player.hands[1];
        const card = game.discardPile.cards.pop();
        hand.cards.push(card);
        player.playerState = playerStates.UP7_PENDING;
    }

    static addToBoard(game, player, team, updateData) {

    }

    static discard(game, player, team, updateData) {

    }

    static resignRequest(game, player, team, updateData) {

    }

    static sortMelds(game, player, team, updateData) {

    }

    static sortRuns(game, player, team, updateData) {

    }

    static pinCard(game, player, team, updateData) {

    }

    static unpinCard(game, player, team, updateData) {

    }

    static undo(game, player, team, updateData) {

    }

    static acceptResign(game, player, team, updateData) {

    }

    static cancelResign(game, player, team, updateData) {

    }

    static acceptEnd(game, player, team, updateData) {

    }

    static cancelEnd(game, player, team, updateData) {

    }

    static acceptDiscard(game, player, team, updateData) {

    }

    static cancelDiscard(game, player, team, updateData) {

    }
}
