if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");
const exphbs  = require('express-handlebars');
const mongoSanitize = require('express-mongo-sanitize');
const multer = require("multer");
const CryptoJS = require("crypto-js");
const gridfs_storage = require("multer-gridfs-storage");
const gridfs_stream = require("gridfs-stream");
const methodOverride = require("method-override");
const bodyParser = require('body-parser');

// define app to use routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dashboardRouter = require('./routes/dashboard');
var signInRouter = require('./routes/signIn');
var signUpRouter = require('./routes/signUp');
var libraryRouter = require('./routes/library')

var app = express();
var hbs = exphbs.create({
    extname: 'hbs', // pass the .hbs extension
    defaultLayout: 'main',  // main.hbs is the default layout used
    layoutDir: path.join(__dirname, "/views/layouts"),  // provide path to layouts
    partialsDir: [
        'views/partials/'   // provide path to partials
    ]
});


//call static files
const static_path = path.join(__dirname, "/public")


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// define custom helper functions for handlebars
hbs.handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

// sanitize query from users.
// remove un-wanted data
app.use(mongoSanitize());
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(bodyParser.json());

// import bootstrap assets for use
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/bootstrap-icons/font', express.static(path.join(__dirname, 'node_modules/bootstrap-icons/font')));

// define routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dashboard', dashboardRouter);
app.use('/sign-in', signInRouter);
app.use('/sign-up', signUpRouter);
app.use('/library', libraryRouter);

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
    res.render('error', { errStatus: err.status });
    // next(createError(404, "This page does not exist!"));
});

module.exports = app;
