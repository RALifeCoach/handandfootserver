import GameModel from '../models/game';
import GameRules from '../events/gameRules';
import { directions, playerStates, gameStates } from './../constants';
import {playerIndexToTeamIndex, sorts, teamStates} from "../constants";
import UserProcesses from "./userProcesses";
import {cryptPassword} from "../utils/passwords";
import _ from 'lodash';

class GameProcesses {
    constructor() {
        this.game = null;
    }

    async updateGame(message) {
        const gameName = message.gameName;
        const direction = directions.find(direction=>direction.direction === message.direction);
        if (!direction) {
            throw new Error('player not found at direction ' + message.direction);
        }
        const playerIndex = direction.playerIndex;
        const actionType = message.type;
        const updateData = message.updateData;

        try {
            this.game = await this.fetchGame(gameName);
        } catch (err) {
            throw err;
        }

        if (!this.game) {
            throw new Error(gameName + ' not found');
        }

        const player = this.game.players[playerIndex];
        const team = this.game.teams[playerIndexToTeamIndex[playerIndex]];

        const { stateErr, action } = GameRules.validateStatesAndActions(this.game.gameState, player.playerState,
            actionType);
        if (stateErr) {
            throw new Error(stateErr);
        }
        const actionErr = GameRules.performValidationAndAction(action, this.game, player, team, updateData);
        if (actionErr) {
            throw new Error(actionErr);
        }

        const broadcastGame = _.cloneDeep(this.game.toObject());
        this.game.messages = [];

        try {
            this.game = await this.game.save();
        } catch (err) {
            throw err;
        }

        UserProcesses.broadcastToAllUsers({
            success: true,
            type: 'update game',
            game: broadcastGame
        });
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

    async createNewGame(gameName, password) {
        const game = new GameModel({
            name: gameName,
            password: password ? cryptPassword(password) : null,
            teams: [
                { score: 0, teamState: teamStates.NOT_ON_TABLE, melds: [] },
                { score: 0, teamState: teamStates.NOT_ON_TABLE, melds: [] }
            ],
            players: [1, 2, 3, 4].map(()=>(
                {
                    connected: false,
                    hands: [{cards: [], sort: sorts.NONE}, {cards: [], sort: sorts.NONE}],
                    inHand: true,
                    cardsToDraw: 0,
                    playerState: playerStates.NOT_JOINED
                }
            )),
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

        this.game = await game.save();
    }

    broadcastGames() {
        GameModel.find({}).populate('players.user').exec((err, games) => {
            if (err) {
                console.log(err.stack);
                return;
            }
            const message = {
                type: 'games list',
                games
            };
            UserProcesses.broadcastToAllUsers(message);
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

    async clearGames(updateData) {
        await GameModel.remove({});
    }
}

export default new GameProcesses();
