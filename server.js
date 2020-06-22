'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
var path = require('path');
var app = express();

// 0. Setting environment
var env = process.env.NODE_ENV || 'local';
var config = require('./config/config')[env];

global.websiteURL = config.url;
console.log("----");
console.log(websiteURL);
// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, 
// password and the database name.
// 1.  MYSQL 
const db = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
    multipleStatements: config.database.multipleStatements
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

//2. Mongoose
//var mongoDB = 'mongodb+srv://yukina:MzogglXhHVRtPKYF@cluster0-ilzuw.mongodb.net/ThaiHung?retryWrites=true&w=majority';
//mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
//var db = mongoose.connection;
//db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// ------------------------

var handlebars = require('express-handlebars').create({
    defaultLayout: 'main',
});

require("./routes/helper").register(handlebars.handlebars);

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


// ------------------------


app.set('port', process.env.PORT || 3000);
//app.use(express.static(__dirname + './public/'));
app.use('/static', express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'yukina',
    resave: true,
    saveUninitialized: true
}));

//var index = require('./routes/routes');
//app.use('/', index);
// Format
//const { getHomePage } = require('./routes/home');

var allRouteFunction = require('./routes/routes');

// Client Page
app.get('/', allRouteFunction.homePageFunction);
app.post('/', allRouteFunction.contactFunction);
app.get('/news', allRouteFunction.newsFunction);
app.get('/news/:index', allRouteFunction.newsPagingFunction);
app.get('/news-details/:id', allRouteFunction.newsDetailsFunction);
app.get('/product/:type/:index', allRouteFunction.productFunction);

app.get('/about', function (req, res, next) {
    res.render('about');
});

app.get('/facility', function (req, res, next) {
    res.render('facility');
});

app.get('/product-details/:id', allRouteFunction.productDetailsFunction);


// Admin Page
const { adminAuthenticate } = require('./routes/auth');

app.get('/admin_login', function (request, response) {
    console.log('admin');
    response.sendFile(path.join(__dirname + '/views/admin/login.html'));
});

app.get('/admin', function (request, response, next) {
    if (request.session.loggedin) {
        response.render('admin/admin-home', { layout: 'admin-main.handlebars' });
    } else {
        response.send('Please login to view this page!');
    }
    //response.end();
});

app.post('/auth', adminAuthenticate);



// ----------------------------------------------------



app.use(function (req, res) {

    res.status(404);
    res.render('404');

});

app.use(function (err,req, res, next) {

    console.error(err.stack);
    res.status(500);
    res.render('500');

});

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port'));
})