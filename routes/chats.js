const express    = require("express"),
    router       = express.Router(),
    findOrCreate = require('mongoose-find-or-create'),
    Chat         = require("../models/chat");

router.get('/sendmsg', (req,res)=> {
    Chat.findOrCreate({
        sender: req.query.sender,
        reciever: req.query.receiver
    }, (err, chat)=> {
        console.log("MESSAGE SENT");
        chat.comments.push({
            text: req.query.msg,
            author: req.query.sender
        });
        chat.save();
        console.log(chat);
        res.send(true);
    });
});

router.get('/recievemsg', (req,res)=> {
    Chat.findOrCreate({
        sender: req.query.sender,
        reciever: req.query.receiver
    }, (err, chat)=> {
        console.log("MESSAGE RECIEVED");
        chat.comments.push({
            text: req.query.msg,
            author: req.query.receiver
        });
        chat.save();
        console.log(chat);
        res.send(true);
    });
});

router.get('/getchat', (req,res)=> {
    Chat.findOrCreate({
        sender: req.query.sender,
        reciever: req.query.reciever
    }, (err,chats)=> {
        console.log(chats.comments);
        res.send(chats.comments);
    });
});

router.get('/clearchat', (req,res)=> {
    Chat.findOrCreate({
        sender: req.query.sender,
        reciever: req.query.reciever
    }, (err,chats)=> {
        chats.comments = [];
        chats.save();
        console.log(chats.comments);
        res.send(true);
    });
});
module.exports = router;