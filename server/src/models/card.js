// get an instance of mongoose and mongoose.Schema
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import {suits} from '../constants';

export default new Schema({
    suit: {
        type: String,
        enum: suits,
    },
    value: {
        type: Number,
        min: -1,
        max: 12
    },
    pinnedSeq: Number,
    isWild: Boolean,
    isRedThree: Boolean
});
