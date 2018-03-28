import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import CardSchema from './card';
import {suits} from '../constants';

export default new Schema({
    type: {
        required: true,
        type: String
    },
    cardValue: {
        type: Number,
        min: 0,
        max: 12
    },
    suit: {
        type: String,
        enum: suits,
    },
    isDirty: Boolean,
    isComplete: Boolean,
    cards: [ CardSchema ]
});
