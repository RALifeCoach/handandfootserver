// get an instance of mongoose and mongoose.Schema
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import historySchema from './history';
import teamSchema from './team';
import pileSchema from './pile';
import handSchema from "./hand";

const GameSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    players: [
        {
            user: {
                ref: 'User',
                type: Schema.Types.ObjectId
            },
            connected: Boolean,
            inHand: Boolean,
            hand: handSchema,
            foot: handSchema
        }
    ],
    password: Schema.Types.Mixed,
    gameComplete: Boolean,
    gameStarted: Boolean,
    teams: [ teamSchema ],
    round: Number,
    currentPlayer: Number,
    piles: [ pileSchema ],
    discardPile: pileSchema,
    history: [ historySchema ]
});

export default mongoose.model('Game', GameSchema, 'Game');
