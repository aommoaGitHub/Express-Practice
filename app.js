const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database')
const mongoose = require('mongoose');

mongoose.connect(config.database);
let db = mongoose.connection;

// Check connection
db.once('open', function() {
  console.log('connected to MongooDB.')
});

// Check for DB errors
db.on('error', console.error.bind(console, 'connection error.'))

// Init App
var app = express()

// Bring in model
const Reward = require('./models/reward') //เพราะเรา export มาแค่ reward

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse applicaion/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

// Set Public folder
app.use(express.static(path.join(__dirname,'public')));

// Express Session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg : msg,
        value : value
      };
    }
}));

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//
app.get('*',function(req, res, next){
  res.locals.user = req.user || null;
  next();
});


// Home Route
// routes handling GET request
// function(req, res) is middleware
app.get('/', function(req, res) {
  // res.send('Hello world'); just sending text
  Reward.find({}, function(err, data) {
    if (err) {
      console.log(err)
    } else {
      res.render('index', {
        title: 'Rewards list',
        rewards: data
      });
    }
  })
});

// Route Files
let rewards = require('./routes/rewards');
let users = require('./routes/users');
app.use('/rewards',rewards)
app.use('/users',users)

// Start Server
app.listen(3000, () => console.log('Example app listening on port 3000!'))
