// get an instance of mongoose and mongoose.Schema
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default new Schema({
    suit: {
        type: String,
        enum: ['Club', 'Diamond', 'Heart', 'Spade', 'Joker' ],
    },
    value: {
        type: Number,
        min: 0,
        max: 12
    },
    pinnedSeq: Number
});
