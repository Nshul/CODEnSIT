const express        = require("express"),
      app            = express(),
      bodyParser     = require("body-parser"),
      mongoose       = require("mongoose"),
      passport       = require("passport"),
      localStrategy  = require("passport-local"),
      User           = require("./models/user"),
      path           = require('path'),
      fs             = require('fs'),
      https          = require('https'),
      ExpPeerServer  = require('peer').ExpressPeerServer,
      flash          = require('connect-flash'),
      methodOverride = require("method-override");

// requiring routes
const indexRoutes = require("./routes/index"),
      chats       = require("./routes/chats"),
      ajax        = require('./routes/ajax');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://anshul98ks123:password@ds147821.mlab.com:47821/finalproject');

app.use(flash());
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
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();app.use(flash());
});

let options = {
    debug: true
};

let server = https.createServer({
    key: fs.readFileSync('./public/server.key'),
    cert: fs.readFileSync('./public/server.crt'),
    passphrase: 'codingblocks',
    requestCert:true,
    rejectUnauthorized: false
},app).listen(process.env.PORT, function () {
    console.log(`Server started on http://localhost:${process.env.PORT}`);
});

let peerServer =  ExpPeerServer(server,options);

app.use('/peerjs',peerServer);
app.use(indexRoutes);
app.use(ajax);
app.use(chats);

peerServer.on('connection',(id)=>{
    console.log("New peer connected:");
    console.log(id);
    console.log(peerServer._clients);
});

peerServer.on('disconnect',(id)=>{
    console.log("Peer disconnected");
    console.log(id);
});
