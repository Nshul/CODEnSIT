const mongoose = require("mongoose");
// schema setup
const chatSchema = mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: 'String'
    },
    otherPerson: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

module.exports = mongoose.model('Chat', chatSchema);