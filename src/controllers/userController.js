import userProcesses from '../processes/userProcesses';
import UserModel from "../models/user";

export default class GameController {
    static users(req, res){
        UserModel.find((err, users) => {
            res.json(users);
        });
    }

    static authenticate(req, res){
        userProcesses.authenticate(req.body.userId, req.body.password, global.app.superSecret)
            .then(token=>{
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            })
            .catch(err=>{
                res.json({
                    success: false,
                    message: err.message
                });
            });
    }
}
