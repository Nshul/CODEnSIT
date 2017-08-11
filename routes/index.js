const express  = require("express"),
      router   = express.Router(),
      User     = require("../models/user"),
      passport = require("passport");

// HOME PAGE
router.get('/', function(req,res){
    res.render('index', {
        page: 'index'
    });
});

// Chat Page
router.get('/chat', function (req,res) {
    res.render('chat', {
        Port: process.env.PORT,
        page: 'chat'
    });
});

// register form
router.get('/signup', (req,res) => {
    res.render('signup');
});

// sign up logic
router.post('/signup', (req,res) => {
    User.register(new User({
        username: req.body.username
    }), req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render("signup");
        }
        passport.authenticate('local')(req,res, function() {
            res.redirect('/');
        });
    });
});

// login form
router.get('/login', (req,res) => {
    res.render('login');
});

// login logic
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/signup'
}), (req,res) => {
});

// logout route
router.get('/logout', (req,res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;