// get an instance of mongoose and mongoose.Schema
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import cardSchema from './card';

export default new Schema({
    cards: [ cardSchema ]
});
