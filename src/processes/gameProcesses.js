import GameModel from '../models/game';
import GameEvents from '../utils/gameEvents';
import { directions } from './../constants';

class GameProcesses {
    constructor() {
        this.game = null;
    }

    async updateGame(gameName, updateData, updateFunction) {
        this.game = await this.fetchGame(gameName);
        if (!this.game) {
            throw new Error(gameName + ' not found');
        }

        updateFunction(updateData);

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
            console.log('find one');
            console.log(GameModel.findOne.toString());
            this.game = await GameModel.findOne({name: gameName});
        } catch (err) {
            this.game = null;
            throw err;
        }
    }

    createNewGame(gameName, password) {
        const game = GameModel.create({
            name: gameName,
            password,
            teams: [
                {
                    score: 0,
                    melds: []
                },
                {
                    score: 0,
                    melds: []
                }
            ],
            players: [{}, {}, {}, {}],
            round: 0,
            gameComplete: false,
            gameStarted: false,
            currentPlayer: -1,
            piles: [],
            discardPile: null,
            historySchema: []
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

    addPlayersFunction(updateData) {
        updateData.players.forEach(playerData =>
            Object.assign(this.game.players[playerData.directionData.playerIndex], {
                connected: false,
                user: playerData.user
            })
        );
    }

    joinGame(updateData) {
        const directionData = directions
            .find(directionInstance => directionInstance.direction === updateData.direction);

        Object.assign(this.game.players[directionData.playerIndex], {
            connected: true,
            user: updateData.userData.user
        });

        // this player is fourth player to join
        if (!Boolean(this.game.players.find(player=> !player.user || !player.connected))) {
            GameEvents.startGame(this.game);
        }
    }
}

export default new GameProcesses();
