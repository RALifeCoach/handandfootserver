// get an instance of mongoose and mongoose.Schema
import mongoose from 'mongoose';
import validator from 'validator'
const Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
export default mongoose.model('User', new Schema({
    name: String,
    password: {
        salt: String,
        passwordHash: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value) => {
            return validator.isEmail(value)
        }
    }
}));
