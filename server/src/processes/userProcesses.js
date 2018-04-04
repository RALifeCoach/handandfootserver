import UserModel from '../models/user';
import GameProcesses from '../processes/gameProcesses';
import GameUtils from '../events/gameUtils';
import {comparePassword, cryptPassword} from '../utils/passwords';
import jwt from 'jsonwebtoken';
import {Map} from 'immutable';

class UserProcesses {
    constructor() {
        this.users = {};
    }

    async setup() {
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

        try {
            await UserModel.remove({});
        } catch (err) {
            throw err;
        }
        try {
            await chris.save();
        } catch (err) {
            throw err;
        }
        try {
            await ronna.save();
        } catch (err) {
            throw err;
        }
        try {
            await peter.save();
        } catch (err) {
            throw err;
        }
        try {
            await elayne.save();
        } catch (err) {
            throw err;
        }
        try {
            await GameProcesses.clearGames();
        } catch (err) {
            throw err;
        }
    }

    async authenticate(userId, password) {
        let user;
        try {
            user = await UserModel.findOne({
                email: userId
            });
        } catch (err) {
            throw err;
        }

        if (!user) {
            throw new Error('Authentication failed.');
        }

        if (!comparePassword(password, user.password)) {
            throw new Error('Authentication failed.');
        }

        const payload = {
            name: user.name,
            id: user._id
        };
        const token = jwt.sign(payload, global.app.superSecret, {
            expiresIn: 1440 // expires in 24 hours
        });
        this.users[token] = {
            user,
            socket: null
        };

        return token;
    }

    getUserFromToken(token) {
        return this.users[token];
    }

    getUserFromSocket(socket) {
        return new Map(this.users).find(user=>user.socket === socket);
    }

    disconnectPlayer(user) {
        return null;
    }

    broadcastToAllUsers(message) {
        GameUtils.stripDownGame(message);
        Object.keys(this.users).forEach((token, userIndex) => {
            const user = this.users[token];
            GameUtils.setPlayerHands(message.game, userIndex);
            if (user.socket) {
                user.socket.send(JSON.stringify(message));
            }
        });
    }
}

export default new UserProcesses();
