import { Range } from 'immutable';
import {gameStates, meldTypes, playerStates, suits, teamStates} from '../constants';
import GameValidations from "./gameValidations";

export default class GameUtils {
    static startGame(game) {
        game.gameState = gameStates.IN_PROGRESS;
        // these values will be incremented in startHand
        game.roundId = 0;
        game.currentPlayerIndex = Math.floor(Math.random() * Math.floor(4));

        GameUtils.startHand(game);
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
            player.discard = null;
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
                isRedThree: (suit === 1 || suit === 2) && value === 1
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

    static nextPlayer(game) {
        const currentPlayer = game.players[game.currentPlayerIndex];
        currentPlayer.discard = null;
        currentPlayer.playerState = playerStates.WAIT;
        game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
        const nextPlayer = game.players[game.currentPlayerIndex];
        nextPlayer.playerState = playerStates.INITIAL_DRAW;
    }

    static endHand(game) {
        if (game.roundId === 7) {
            GameUtils.endGame(game);
        } else {
            GameUtils.startHand(game);
        }
    }

    static endGame(game) {
        game.gameState = gameStates.COMPLETED;
    }

    static createMeld(selectedCards, player, team) {
        if (selectedCards[0].isRedThree) {
            team.melds.push(...selectedCards.map(card=>(
                {
                    type: meldTypes.RED_THREE,
                    cardValue: card.value,
                    suit: card.suit,
                    isDirty: false,
                    isComplete: true,
                    cards: [ card ]
                }
            )));
            player.playerState = playerStates.DRAW;
            player.cardsToDraw = selectedCards.length;
            return;
        }
        // try meld
        if (!GameValidations.validateMeld({
                type: meldTypes.MELD,
                value: selectedCards[0].value,
                cards: []
            }, selectedCards)) {
            team.melds.push({
                type: meldTypes.MELD,
                cardValue: selectedCards[selectedCards.length - 1].value,
                isDirty: Boolean(selectedCards.find(card=>card.isWild)),
                isComplete: selectedCards.length === 7,
                cards: [ ...selectedCards ]
            });
            return;
        }
        // try wild cards
        if (selectedCards[0].isWild) {
            if (!GameValidations.validateMeld({
                    type: meldTypes.WILD_CARDS
                }, selectedCards)) {
                team.melds.push({
                    type: meldTypes.WILD_CARDS,
                    isDirty: false,
                    isComplete: selectedCards.length === 7,
                    cards: [ ...selectedCards ]
                });
            }
            return;
        }
        // try run
        if (!GameValidations.validateMeld({
                type: meldTypes.RUN,
                cards: [],
                suit: selectedCards[0].suit
            }, selectedCards)) {
            team.melds.push({
                type: meldTypes.RUN,
                suit: selectedCards[0].suit,
                isDirty: false,
                isComplete: selectedCards.length === 7,
                cards: [ ...selectedCards ]
            });
        }
    }

    static removeCardsFromHand(player, selectedCards) {
        // remove the cards from the hand/foot
        const hand = player.inHand ? player.hands[0] : player.hands[1];
        selectedCards.forEach(selectedCard=>{
            const cardIndex = hand.cards.findIndex(card=>card._id === selectedCard._id);
            hand.cards.splice(cardIndex, 1);
        });

        if (player.playerState === playerStates.PLAY && player.inHand) {
            player.inHand = false;
        }
    }

    static canEndHand(team) {
        const hasCleanMeld = Boolean(
            team.melds.find(meld=>meld.isComplete && meld.type === meldTypes.MELD && !meld.isDirty));
        const hasDirtyMeld = Boolean(
            team.melds.find(meld=>meld.isComplete && meld.type === meldTypes.MELD && meld.isDirty));
        return hasCleanMeld && hasDirtyMeld;
    }

    static stripDownGame(message) {
        if (!message.game) {
            this.originalGame = null;
            return;
        }
        this.originalGame = message.game;
        const game = JSON.parse(JSON.stringify(message.game));
        game.pileCounts = game.piles.map(pile=>pile.cards.length);
        delete game.piles;
        game.discardPileCount = game.discardPile.cards.length;
        game.discardPileTopCard = game.discardPile.cards[game.discardPile.cards.length - 1];
        delete game.discardPile;
        game.players.forEach(player=> {
            player.handCount = player.inHand ? player.hands[0].cards.length : player.hands[1].cards.length;
            delete player.hands;
        });
        game.teams.forEach(team=>{
            team.scoreCurrentHand = GameUtils.scoreTeam(team);
        });
        game.undoCount = game.undo.length;
        delete game.undo;
        message.game = game;
    }

    static setPlayerHands(game, userIndex) {
        if (!this.originalGame) {
            return;
        }
        game.players.forEach(player=> {
            if (player.hand) {
                delete player.hand;
            }
        });
        game.players[userIndex].hand = game.players[userIndex].inHand
            ? this.originalGame.players[userIndex].hands[0]
            : this.originalGame.players[userIndex].hands[1];
    }

    static scoreTeam(team) {
        return team.melds.reduce(GameUtils.scoreMeld, 0);
    }

    static scoreMeld(score, meld) {
        switch (meld.type) {
            case meldTypes.RED_THREE:
                return score + 100;
            case meldTypes.RUN:
                return score + (meld.isComplete ? 2000 : -2000);
            case meldTypes.WILD_CARDS:
                return score + (meld.isComplete ? 1000 : -1000);
            case meldTypes.MELD:
                if (meld.isComplete) {
                    return score + (meld.isDirty ? 300 : 500);
                }
                return score;
            default:
                return score;
        }
    }
}
