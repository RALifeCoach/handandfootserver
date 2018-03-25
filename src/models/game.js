// get an instance of mongoose and mongoose.Schema
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import historySchema from './history';
import cardSchema from './card';

const GameSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        salt: String,
        token: String
    },
    gameState: String,
    roundId: Number,
    teams: [
        {
            score: Number,
            teamState: String,
            melds: [
                {
                }
            ]
        }
    ],
    currentPlayerIndex: Number,
    players: [
        {
            user: {
                ref: 'User',
                type: Schema.Types.ObjectId
            },
            playerState: String,
            cardsToDraw: Number,
            inHand: Boolean,
            hands: [ {
                cards: [ cardSchema ],
                sort: String
            } ]
        }
    ],
    piles: [
        {
            cards: [ cardSchema ]
        }
    ],
    discardPileLocked: Boolean,
    discardPile: {
        cards: [ cardSchema ]
    },
    history: [ historySchema ],
    undo: [],
    messages: []
});

export default mongoose.model('Game', GameSchema, 'Game');
