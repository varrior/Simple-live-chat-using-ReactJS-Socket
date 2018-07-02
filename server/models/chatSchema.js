const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let chatSchema = new Schema({
    author: {
        required: true,
        type: String
    },
    body: {
        required: true,
        type: String
    },
    date: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model('Chat', chatSchema);