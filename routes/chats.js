const express    = require("express"),
    router       = express.Router(),
    findOrCreate = require('mongoose-find-or-create'),
    Chat         = require("../models/chat");

router.post('/sendmsg', (req,res)=> {
    Chat.findOrCreate({
        sender: req.body.sender,
        reciever: req.body.reciever
    }, (err, chat)=> {
        console.log("MESSAGE SENT");
        chat.comments.push({
            text: req.body.msg,
            author: req.body.sender
        });
        chat.save();
        console.log(chat);
        res.send(true);
    });
});

router.post('/recievemsg', (req,res)=> {
    Chat.findOrCreate({
        sender: req.body.sender,
        reciever: req.body.reciever
    }, (err, chat)=> {
        console.log("MESSAGE RECIEVED");
        chat.comments.push({
            text: req.body.msg,
            author: req.body.reciever
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

router.post('/clearchat', (req,res)=> {
    Chat.findOrCreate({
        sender: req.body.sender,
        reciever: req.body.reciever
    }, (err,chats)=> {
        console.log(req.body);
        chats.comments = [];
        chats.save();
        console.log(chats.comments);
        res.send(true);
    });
});
module.exports = router;