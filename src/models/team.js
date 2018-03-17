// get an instance of mongoose and mongoose.Schema
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import meldSchema from './meld';

export default new Schema({
    score: Number,
    melds: [ meldSchema ]
});
