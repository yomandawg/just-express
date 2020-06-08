var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/* PASSPORT FILES */
const session = require('express-session');
const passport = require('passport');
const GithubStrategy = require('passport-github').Strategy;
/* ============== */

var indexRouter = require('./routes/index');

var app = express();

// `helmet` security middleware
const helmet = require('helmet');
app.use(helmet());

/* PASSPORT CONFIG */
app.use(session({
  secret: 'any salt', // password salt
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
const passportConfig = require('./config');
passport.use(new GithubStrategy(passportConfig,
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile); // callback
  })
);
passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});
/* =============== */

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
