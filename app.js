var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var fs = require('fs');
var util = require('util');
var bodyParser = require("body-parser");
var readdir = util.promisify(fs.readdir);
var cors = require('cors');

require('dotenv').config()


var usersRouter = require('./routes/users');
var itemsRouter = require('./routes/items');
var bidsRouter = require('./routes/bids');
var tradesRouter = require('./routes/trades');
var confirmBid = require('./routes/confirmBid');

var app = express();
app.use(cors({
  origin: 'http://localhost:3001'
}));

mongoose.connect(process.env.DB_URL)
  .then(() => console.log("connected to mongoDB"))
  .catch((err) => console.log(err))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, "./frontend/build")));
app.use(express.static(path.join(__dirname, 'frontend/build')));
app.use(express.static(path.join(__dirname, 'public')));

//configure routes
app.use('/api/users', usersRouter);
app.use('/api/items', itemsRouter);
app.use('/api/bids', bidsRouter);
app.use('/api/trades', tradesRouter);
app.use('/api/confirmBid', confirmBid);
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {                       
  res.sendFile(path.resolve(__dirname+'/frontend/build/index.html'));                               
});


// const routesdir = `${__dirname}/routes`;
// readdir(routesdir).then(files => {
//     files.forEach(filename => {
//       console.log(`/api/${filename.replace(/\.[^.]*$/, '')}`)
//       app.use(`/api/${filename.replace(/\.[^.]*$/, '')}`, require(`${routesdir}/${filename}`));
//     });
// });

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
  res.render('error', { title: 'Express' });
});



module.exports = app;
