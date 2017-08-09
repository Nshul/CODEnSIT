const express        = require("express"),
      app            = express(),
      bodyParser     = require("body-parser"),
      mongoose       = require("mongoose"),
      passport       = require("passport"),
      localStrategy  = require("passport-local"),
      User           = require("./models/user"),
      path           = require('path'),
      methodOverride = require("method-override");

// requiring routes
const indexRoutes = require("./routes/index");

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://anshul98ks123:password@ds147821.mlab.com:47821/finalproject');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use('/', express.static(path.join(__dirname, 'public')));

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: 'I am the best',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware which will run for every route
// it will send the user details by passport to every page
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

app.use(indexRoutes);

app.listen(8000, () => {
    console.log('Server has started');
});