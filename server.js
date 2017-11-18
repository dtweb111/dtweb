var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('./config/config');
var home = require('./routes/home');
var search = require('./routes/search');
var play = require('./routes/play');
var badRequest = require('./routes/badRequest');
var associate = require('./routes/associate');
var io = require('./src/services/io');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'dist', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', home);
app.use('/search', search);
app.use('/play', play);
app.use('/associate', associate);
app.use('/bad', badRequest);

// catch 404 and redirect to `/bad`
app.use(io.redirect2BadRequest);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = config.env === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// `uncaughtException` handler to evite node server exit when uncaught exception bubbled to process
process.on('uncaughtException', (err) => {
  io.logFile('express', err.message);
});

module.exports = app;
