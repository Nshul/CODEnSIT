const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    username:'String',
    password: 'String',
    status: 'String'
    // chats: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Chat'
    //     }
    // ]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);