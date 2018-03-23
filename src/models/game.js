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
    players: [
        {
            user: {
                ref: 'User',
                type: Schema.Types.ObjectId
            },
            playerState: String,
            inHand: Boolean,
            hands: [ {
                cards: [ cardSchema ],
                sort: String
            } ]
        }
    ],
    password: {
        salt: String,
        token: String
    },
    gameState: String,
    teams: [
        {
            score: Number,
            melds: [
                {
                    type: String,
                    cardValue: {
                        type: Number,
                        min: 0,
                        max: 12
                    },
                    suit: {
                        type: String,
                        enum: ['Club', 'Diamond', 'Heart', 'Spade', 'Joker' ],
                    },
                    meldComplete: Boolean,
                    cards: [ cardSchema ]
                }
            ]
        }
    ],
    roundId: Number,
    currentPlayerIndex: Number,
    currentPlayerState: String,
    piles: [
        {
            cards: [ cardSchema ]
        }
    ],
    discardPile: {
        cards: [ cardSchema ]
    },
    history: [ historySchema ],
    undo: [],
    messages: []
});

export default mongoose.model('Game', GameSchema, 'Game');
