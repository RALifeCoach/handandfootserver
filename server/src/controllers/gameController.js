import GameProcesses from '../processes/gameProcesses';
import GameModel from "../models/game";
import UserModel from "../models/user";
import { directions } from '../constants';

export default class GameController {
    static games(req, res){
        GameModel.find({}).populate('players.user').exec((err, games) => {
            res.json({ success: true, games });
        });
    }

    static createNewGame(req, res){
        const gameName = req.query.gameName;
        GameProcesses.createNewGame(gameName)
            .then(doc => {
                res.json({ success: true });
                GameProcesses.broadcastGames();
            })
            .catch(err => {
                console.log(err.stack);
                res.json({ success: false, message: err.message })
            });
    }

    static addPlayers(req, res){
        const messages = [];
        const players = directions
            .map(direction=>(
                {
                    directionData: direction,
                    email: req.body[direction.direction]
                }))
            .filter(playerData=>Boolean(playerData.email));

        Promise.all(players.map(playerData=>(
            new Promise(resolve=> {
                UserModel.findOne({
                    email: playerData.email
                }, (err, user) => {
                    if (err || !user) {
                        messages.push(`${playerData.email} not found.`);
                    } else {
                        playerData.user = user;
                    }
                    resolve();
                });
            })
        ))).then(() =>
            {
                if (messages.length) {
                    res.json({
                        success: false,
                        messages
                    });
                    return;
                }
                GameProcesses.updateGame(req.body.gameName, {players},
                        updateData => GameProcesses.addPlayers(updateData))
                    .then(()=>{
                        res.json({
                            success: true
                        });
                    })
                    .catch(err=>{
                        res.json({
                            success: false,
                            message: err.message
                        })
                    });
            }
        ).catch(err=>{throw err;});
    }
}
