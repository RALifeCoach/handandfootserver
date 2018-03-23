import GameModel from '../models/game';
import GameRules from '../events/gameRules';
import { directions, undoOptions, playerStates, gameStates } from './../constants';

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

        try {
            const action = GameRules.validateStatesAndActions(this.game.gameState, player.playerState,
                actionType, updateData);
            GameRules.performValidationAndAction(action, this.game, player, updateData);
        } catch(err) {
            throw err;
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
                { score: 0, melds: [] },
                { score: 0, melds: [] }
            ],
            players: [
                {playerState: playerStates.NOT_JOINED},
                {playerState: playerStates.NOT_JOINED},
                {playerState: playerStates.NOT_JOINED},
                {playerState: playerStates.NOT_JOINED}
            ],
            roundId: 0,
            gameState: gameStates.NOT_STARTED,
            currentPlayerIndex: -1,
            piles: [ { cards: [] }, { cards: [] }, { cards: [] }, { cards: [] } ],
            discardPile: [ { cards: [] } ],
            historySchema: [],
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
