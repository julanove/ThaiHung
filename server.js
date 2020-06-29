'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
var path = require('path');
var app = express();

//var busboyBodyParse = require('busboy-body-parser');
//var busboy = require('busboy');

// 0. Setting environment
var env = process.env.NODE_ENV || 'local';
var config = require('./config/config')[env];

console.log("----");
global.websiteURL = config.url;
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
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

//app.use(busboyBodyParse());
//app.use(busboy);

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

//---------------------------------------------------------- Client Page

app.post('/', allRouteFunction.contactFunction);
app.get('/news', allRouteFunction.newsFunction);
app.get('/news/:index', allRouteFunction.newsPagingFunction);
app.get('/news-details/:newid', allRouteFunction.newsDetailsFunction);
app.get('/product/:type/:index', allRouteFunction.productFunction);
app.get('/product-details/:id', allRouteFunction.productDetailsFunction);
app.get('/about', function (req, res, next) {
    res.render('about', {
        layout: 'main',
        websiteURL: websiteURL
    });
});
app.get('/facility', function (req, res, next) {
    res.render('facility', {
        layout: 'main',
        websiteURL: websiteURL
    });
});

//---------------------------------------------------------- Admin ROUTE 

app.get('/admin_login', function (request, response) {
    console.log('admin');
    response.sendFile(path.join(__dirname + '/views/admin/login.html'));
});

app.get('/admin', function (request, response, next) {
    if (request.session.loggedin) {
        response.render('admin/admin-home', {
            layout: 'admin-main',
            websiteURL: websiteURL
        });
    } else {
        response.sendFile(path.join(__dirname + '/views/admin/login.html'));
    }
});

app.get('/admin/news', allRouteFunction.adminNews);

app.get('/admin/newsadd', allRouteFunction.adminNewsAdd);

app.get('/admin/newsdetails/:newid', allRouteFunction.adminNewsDetails);

app.get('/admin/type', allRouteFunction.adminType);

app.get('/admin/product', allRouteFunction.adminProduct);

//---------------------------------------------------------- Admin API

app.post('/auth', allRouteFunction.authen);

app.post('/changePass', allRouteFunction.changePass); 

app.post('/newsInsert', allRouteFunction.newsInsert);

app.post('/newsUpdate', allRouteFunction.newsUpdate);

app.post('/newsDelete', allRouteFunction.newsDelete);

app.post('/typeInsert', allRouteFunction.typeInsert);

app.post('/typeUpdate', allRouteFunction.typeUpdate);

app.post('/typeDelete', allRouteFunction.typeDelete);

app.post('/productInsert', allRouteFunction.productInsert);

//app.post('/productUpdate', allRouteFunction.producteUpdate);

//app.post('/productDelete', allRouteFunction.productDelete);


// ---------------------------------------------------- TEST PAGE

var multer = require('multer');
const filehelpers = require('./routes/filehelper');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

app.get('/', allRouteFunction.adminProduct);

app.post('/imageInsert',  (req, res) => {x

    let upload = multer({ storage: storage, fileFilter: filehelpers.imageFilter }).single('profile_pic');

    upload(req, res, function (err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }

        console.log('Image Upload Result:');
        console.log(req.file.filename);
        // Display uploaded image for user validation
        res.send(JSON.stringify({ status: "OK", filename: req.file.filename }));
    });

});

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
    console.log('Express started on ' + websiteURL +':' + app.get('port'));
})