var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
const ejs = require('ejs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var expressValidator=require('express-validator');
var flash=require('connect-flash');
var session=require('express-session');
var nodemailer = require('nodemailer');
var passport=require('passport');
var dataBase = require('./configs/database/db');
var index = require('./routes/home/index');
var MongoStore = require('connect-mongo')(session)
var configAuth = require('./configs/auth');
var login = require('./routes/login/login');
var register = require('./routes/register/register');
var welcome = require('./routes/welcome/welcome');
var logout = require('./routes/logout/logout');
var forgot = require('./routes/forgot/forgot');
var app = express();

// view engine setup

app.engine('ejs', require('express-ejs-extend'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Session Middleware
app.use(session({
    secret: 'H@-rsH/',
    saveUninitialized: false, // don't create session until something stored
	resave: false, //don't save session if unmodified
	store: new MongoStore({
		url: 'mongodb://localhost:27017/login_db',
		touchAfter: 24 * 3600 // time period in seconds
	})
}));
app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});
// app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

//messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


//Validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Passport config File
require('./configs/passport/passport')(passport);
//passport Middleware

  app.use(passport.initialize());
  app.use(passport.session());

  app.use('*',function(req,res,next){
  
    res.locals.user=req.user||null;
    next();
  })

app.use('/', index);
app.use('/login', login);
app.use('/register', register);

app.use('/welcome', welcome);
app.use('/logout', logout);
app.use('/forgot',forgot);


//  var  smtpTrans = nodemailer.createTransport('SMTP', {
//       service: 'Gmail',
//       auth: {
//           user: "hkcs1995@gmail.com",
//           pass: "qwert123@1995" 
//       }
//   });
 

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
