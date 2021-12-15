const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//mongoDB
const mongoose = require('mongoose');
const dbConfig = require('./config/db_config.json');
const dbAddress = 'mongodb://'+dbConfig.user+":"+dbConfig.password+'@'+dbConfig.host+':'+dbConfig.port+'/'+dbConfig.database+'?retryWrites=true&w=majority';

// Routes
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/member/login');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes use
app.use('/', indexRouter);
app.use('/login',loginRouter);

//DB Connection
mongoose.connect(dbAddress);
const mongoDB = mongoose.connection;
// 연결 실패
mongoDB.on('error', function(){
    console.log('Connection Failed!');
});
// 연결 성공
mongoDB.once('open', function() {
    console.log('Connected!');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log("[ERROR] : staus: "+err.status+" message : "+ err.message)
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
