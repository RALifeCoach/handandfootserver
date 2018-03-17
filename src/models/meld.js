// get an instance of mongoose and mongoose.Schema
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import cardSchema from './card';

export default new Schema({
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
});
