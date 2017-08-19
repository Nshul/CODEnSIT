const mongoose = require("mongoose");
const findOrCreate = require('mongoose-find-or-create');

// schema setup
const chatSchema = mongoose.Schema({
    sender: 'String',
    reciever: 'String',
    comments: [
        {
            author: 'String',
            text: 'String'
        }
    ]
});

chatSchema.plugin(findOrCreate);
module.exports = mongoose.model('Chat', chatSchema);