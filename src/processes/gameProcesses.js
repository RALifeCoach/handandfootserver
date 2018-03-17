import GameModel from '../models/game';

class GameProcesses {
    constructor() {
        this.game = null;
    }

    fetchGame(gameName) {
        return new Promise((resolve, reject)=>{
            GameModel.findOne({name: gameName}, (err, game)=>{
                if (err || !game) {
                    reject(`${gameName} not found`);
                } else {
                    this.game = game;
                    resolve();
                }
            });
        });
    }

    createNewGame(gameName, password) {
        const game = new GameModel({
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

    addPlayers(gameName, players) {
        return new Promise((resolve, reject)=>{
            (!this.game || this.game.name !== gameName
                ? this.fetchGame(gameName)
                : new Promise(innerResolve=>innerResolve()))
                .then(()=> {
                    if (!this.game) {
                        reject(gameName + ' not found');
                        return;
                    }
                    console.log(players);
                    players.forEach(playerData =>
                        Object.assign(this.game.players[playerData.directionData.team * 2
                            + playerData.directionData.player], {
                            connected: false,
                            user: playerData.user
                        })
                    );
                    console.log(this.game.players[0]);
                    this.game.save((err, game)=>{
                        if (err) {
                            reject(err);
                        } else {
                            this.game = game;
                            resolve();
                        }
                    })
                });
        }).catch(err=>{throw err;});
    }

    joinGame(gameName, direction, user) {
        return new Promise((resolve, reject)=>{
            (!this.game || this.game.name !== gameName
                ? this.fetchGame(gameName)
                : new Promise(innerResolve=>innerResolve()))
                .then(()=> {
                    if (!this.game) {
                        reject(gameName + ' not found');
                        return;
                    }

                    players.forEach(playerData =>
                        Object.assign(this.game.players[playerData.directionData.team * 2
                        + playerData.directionData.player], {
                            connected: false,
                            user: playerData.user
                        })
                    );

                    this.game.save((err, game)=>{
                        if (err) {
                            reject(err);
                        } else {
                            this.game = game;
                            resolve();
                        }
                    })
                });
        }).catch(err=>{throw err;});
    }
}

export default new GameProcesses();
