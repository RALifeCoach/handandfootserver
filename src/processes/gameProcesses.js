import GameModel from '../models/game';
import GameRules from '../events/gameRules';
import { directions, undoOptions, playerStates, gameStates } from './../constants';
import {playerIndexToTeamIndex, teamStates} from "../constants";

class GameProcesses {
    constructor() {
        this.game = null;
    }

    async updateGame(gameName, playerIndex, actionType, updateData) {
        try {
            this.game = await this.fetchGame(gameName);
        } catch (err) {
            throw err;
        }

        if (!this.game) {
            throw new Error(gameName + ' not found');
        }

        const player = this.game.players[playerIndex];
        if (!player) {
            throw new Error('player not found at index ' + playerIndex);
        }
        const team = this.game.teams[playerIndexToTeamIndex[playerIndex]];

        const { stateErr, action } = GameRules.validateStatesAndActions(this.game.gameState, player.playerState,
            actionType, updateData);
        if (stateErr) {
            throw new Error(stateErr);
        }
        const actionErr = GameRules.performValidationAndAction(action, this.game, player, team, updateData);
        if (actionErr) {
            throw new Error(actionErr);
        }

        try {
            this.game = await this.game.save();
        } catch (err) {
            throw err;
        }
    }

    async fetchGame(gameName) {
        if (this.game && this.game.name === gameName) {
            return this.game;
        }
        try {
            return await GameModel.findOne({name: gameName});
        } catch (err) {
            throw err;
        }
    }

    createNewGame(gameName, password) {
        const game = GameModel.create({
            name: gameName,
            password,
            teams: [
                { score: 0, teamState: teamStates.NOT_ON_TABLE, melds: [] },
                { score: 0, teamState: teamStates.NOT_ON_TABLE, melds: [] }
            ],
            players: [
                { "connected": false, "hands": [{"cards": [], "sort": "none"},
                        {"cards": [], "sort": "none"}], "inHand": true, playerState: playerStates.NOT_JOINED },
                { "connected": false, "hands": [{"cards": [], "sort": "none"},
                        {"cards": [], "sort": "none"}], "inHand": true, playerState: playerStates.NOT_JOINED },
                { "connected": false, "hands": [{"cards": [], "sort": "none"},
                        {"cards": [], "sort": "none"}], "inHand": true, playerState: playerStates.NOT_JOINED },
                { "connected": false, "hands": [{"cards": [], "sort": "none"},
                        {"cards": [], "sort": "none"}], "inHand": true, playerState: playerStates.NOT_JOINED }
            ],
            roundId: 0,
            gameState: gameStates.NOT_STARTED,
            currentPlayerIndex: -1,
            piles: [ { cards: [] }, { cards: [] }, { cards: [] }, { cards: [] } ],
            discardPileLocked: false,
            discardPile: [ { cards: [] } ],
            history: [],
            undo: [],
            messages: [],
        });

        return new Promise((resolve, reject)=>{
            game.save()
                .then(doc => {
                    this.game = doc;
                    resolve();
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    addPlayers(updateData) {
        updateData.players.forEach(playerData =>
            Object.assign(this.game.players[playerData.directionData.playerIndex], {
                connected: false,
                user: playerData.user
            })
        );
    }
}

export default new GameProcesses();
