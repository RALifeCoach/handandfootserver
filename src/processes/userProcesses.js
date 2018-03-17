import UserModel from '../models/user';
import GameModel from '../models/game';
import {comparePassword, cryptPassword} from "../utils/passwords";
import jwt from "jsonwebtoken";

class UserProcesses {
    constructor() {
        this.users = {};
    }

    setup() {
        const chris = new UserModel({
            name: 'Chris',
            password: cryptPassword('chris@gmail.com'),
            email: 'chris@gmail.com'
        });
        const ronna = new UserModel({
            name: 'Ronna',
            password: cryptPassword('ronna@gmail.com'),
            email: 'ronna@gmail.com'
        });
        const peter = new UserModel({
            name: 'Peter',
            password: cryptPassword('peter@gmail.com'),
            email: 'peter@gmail.com'
        });
        const elayne = new UserModel({
            name: 'Elayne',
            password: cryptPassword('elayne@gmail.com'),
            email: 'elayne@gmail.com'
        });

        return new Promise((resolve, reject)=> {
            UserModel.remove({}, () => {
                chris.save(errChris => {
                    if (errChris) {
                        reject(errChris);
                        return;
                    }

                    console.log('Chris saved successfully');
                    ronna.save(errRonna => {
                        if (errRonna) {
                            reject(errRonna);
                            return;
                        }

                        console.log('Ronna saved successfully');
                        peter.save(errPeter => {
                            if (errPeter) {
                                reject(errPeter);
                                return;
                            }

                            console.log('Peter saved successfully');
                            elayne.save(errElayne => {
                                if (errElayne) {
                                    reject(errElayne);
                                    return;
                                }

                                console.log('Elayne saved successfully');
                                GameModel.remove({}, () => {
                                    resolve();
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    authenticate(userId, password, superSecret) {
        return new Promise((resolve, reject)=>{
            UserModel.findOne({
                email: userId
            }, (err, user) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (!user) {
                    reject(new Error('Authentication failed.'));
                    return;
                }

                if (!comparePassword(password, user.password)) {
                    reject(new Error('Authentication failed.'));
                    return;
                }

                const payload = {
                    name: user.name,
                    id: user._id
                };
                const token = jwt.sign(payload, superSecret, {
                    expiresIn: 1440 // expires in 24 hours
                });
                this.users[token] = user;

                resolve(token);
            });
        })
    }

    getUserFromToken(token) {
        return this.users[token];
    }
}

export default new UserProcesses();
