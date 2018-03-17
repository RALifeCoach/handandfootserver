// get an instance of mongoose and mongoose.Schema
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default new Schema({
    round: Number,
    team1Score: Number,
    team2Score: Number
});
