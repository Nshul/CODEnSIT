const express  = require("express"),
    router   = express.Router(),
    User     = require("../models/user");

router.get('/getpeerId', (req,res) => {
    User.findOne({
        username: req.query.username
    }).then((User) => {
        console.log(User);
        res.send(User._id);
    }).catch(() => {
        res.send('0');
    })
});

router.get('/getusername', (req,res) => {
    User.findById(req.query.id).then((User) => {
        res.send(User.username);
    }).catch(() => {
        res.send('0');
    });
});

module.exports = router;