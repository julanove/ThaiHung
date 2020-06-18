'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
var path = require('path');
var app = express();

// ------------------------

// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, 
// password and the database name.
// 1.  MYSQL 
const db = mysql.createConnection({
    host: '18.178.72.199',
    user: 'yukina',
    password: 'yukina@123',
    database: 'yukina',
    multipleStatements: true
});

// connect to database
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
    helpers: {
        formatDate: require('./routes/dateformat') 
    }
});



app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


// ------------------------


app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
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
const { getHomePage } = require('./routes/home');



// Client Page
app.get('/', getHomePage);

app.post("/", function (req, res) {

    var status = JSON.stringify({
        status: req.body.status,
        userObject: req.body.userObject
    })

    console.log("status: " + req.body.company);

    let insertQuery = 'INSERT INTO contact (company, content, country, date, isRead, name) VALUES(?, ?, ?, now(), 0, ?)';
    let query = mysql.format(insertQuery, [req.body.company, req.body.content, req.body.country, req.body.name]);
    db.query(query, (err, response) => {
        if (err) {
            console.error(err);
            return;
        }
    });

    console.log(req.body.status);
    res.status(200).send(JSON.stringify({ status: "OK" }));
})


app.get('/about', function (req, res, next) {
    res.render('about');
});

app.get('/product', function (req, res, next) {
    res.render('product');
});

app.get('/facility', function (req, res, next) {
    res.render('facility');
});

app.get('/news', function (req, res, next) {
    res.render('news');
});

app.post('/contact')


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