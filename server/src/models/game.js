// get an instance of mongoose and mongoose.Schema
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import MeldSchema from './meld';
import HistorySchema from './history';
import CardSchema from './card';

export default mongoose.model('Game', new Schema({
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
            scorePriorHands: Number,
            teamState: String,
            melds: [ MeldSchema ]
        }
    ],
    currentPlayerIndex: Number,
    players: [
        {
            user: {
                ref: 'User',
                type: Schema.Types.ObjectId
            },
            discard: CardSchema,
            playerState: String,
            cardsToDraw: Number,
            inHand: Boolean,
            hands: [ {
                cards: [ CardSchema ],
                sort: String
            } ]
        }
    ],
    piles: [
        {
            cards: [ CardSchema ]
        }
    ],
    discardPileLocked: Boolean,
    discardPile: {
        cards: [ CardSchema ]
    },
    history: [ HistorySchema ],
    undo: [],
    messages: []
}));
