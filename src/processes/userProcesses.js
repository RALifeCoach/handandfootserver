import UserModel from '../models/user';
import GameModel from '../models/game';
import {comparePassword, cryptPassword} from '../utils/passwords';
import jwt from 'jsonwebtoken';

class UserProcesses {
    constructor() {
        this.users = {};
    }

    static async setup() {
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
            await GameModel.clearGames();
        } catch (err) {
            throw err;
        }
    }

    async authenticate(userId, password, superSecret) {
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
        const token = jwt.sign(payload, superSecret, {
            expiresIn: 1440 // expires in 24 hours
        });
        this.users[token] = {
            user
        };

        return token;
    }

    getUserFromToken(token) {
        return this.users[token];
    }

    broadcastToAllUsers(message) {
        const originalGame = this.stripDownGame(message);
        Object.keys(this.users).forEach((token, userIndex) => {
            const user = this.users[token];
            this.setPlayerHands(message.game, originalGame, userIndex);
            if (user.socket) {
                user.socket.send(JSON.stringify(message));
            }
        });
    }

    stripDownGame(message) {
        if (!message.game) {
            return null;
        }
        const originalGame = message.game;
        const game = JSON.parse(JSON.stringify(message.game));
        game.pileCounts = game.piles.map(pile=>pile.cards.length);
        delete game.piles;
        game.discardPileCount = game.discardPile.cards.length;
        game.discardPileTopCard = game.discardPile.cards[game.discardPile.cards.length - 1];
        delete game.discardPile;
        game.players.forEach(player=> {
            player.handCounts = player.hands.map(hand=>hand.cards.length);
            delete player.hands;
        });
        game.undoCount = game.undo.length;
        message.game = game;
        return originalGame;
    }

    setPlayerHands(game, originalGame, userIndex) {
        if (!originalGame) {
            return;
        }
        game.players.forEach(player=> {
            if (player.hand) {
                delete player.hand;
            }
        });
        game.players[userIndex].hand = game.players[userIndex].inHand
            ? originalGame.players[userIndex].hands[0]
            : originalGame.players[userIndex].hands[1];
    }
}

export default new UserProcesses();
