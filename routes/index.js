const express  = require("express"),
      router   = express.Router(),
      User     = require("../models/user"),
      passport = require("passport");

// HOME PAGE
router.get('/', function(req,res){
    res.render('landing');
});

// register form
router.get('/register', (req,res) => {
    res.render('register');
});

// sign up logic
router.post('/register', (req,res) => {
    User.register(new User({
        username: req.body.username
    }), req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate('local')(req,res, function() {
            res.redirect('/home');
        });
    });
});

// login form
router.get('/login', (req,res) => {
    res.render('login');
});

// login logic
router.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/register'
}), (req,res) => {
});

// logout route
router.get('/logout', (req,res) => {
    req.logout();
    res.redirect('/home');
});

module.exports = router;