var mysql = require('mysql');
var env = process.env.NODE_ENV || 'local';
var config = require('../config/config')[env];
const jwt = require('jsonwebtoken');


module.exports = {
    homePageFunction: function (req, res) {

        console.log('Home URL');
        console.log(websiteURL);

        db.query('SELECT * FROM media where mediaType = 1 limit 8; SELECT * FROM news order by newID desc limit 4;',
            function (err, results) {
                //connection.release();
                res.render('home', {
                    page_name: 'home',
                    layout: 'main',
                    data: {
                        media: results[0],
                        news: results[1],
                    },
                    websiteURL: websiteURL
                });
                if (err) console.log(err);
                //console.log('queries done', results);
            }
        );
    },

    contactFunction: function (req, res) {

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

    },

    newsFunction: function (req, res) {

        db.query('SELECT * FROM news order by newID desc limit 5; select count(*) as count from news;',
            function (err, results) {
                //console.log(results[1][0].count);
                res.render('news', {
                    page_name: 'news',
                    layout: 'main',
                    data: {
                        news: results[0],
                        count: results[1][0].count,
                        offset: 5,
                        current: 1,
                        type: "news"
                    },
                    websiteURL: websiteURL
                });
                if (err) console.log(err);
            }
        );

    },

    newsPagingFunction: function (req, res) {

        var index = req.params.index;
        var max = index * 5; 
        var start = max - 5; 

        //console.log('start:');
        //console.log(start);

        //console.log('max:');
        //console.log(max);

        db.query('SELECT * FROM news order by newID desc limit ' + start + ', 5 ; select count(*) as count from news;' ,
            function (err, results) {
                //console.log(results[1]);
                res.render('news', {
                    layout: 'main',
                    data: {
                        news: results[0],
                        count: results[1][0].count,
                        offset: 5,
                        current: index,
                        type: "news"
                    }
                });
                if (err) console.log(err);
            }
        );

    },

    newsDetailsFunction: function (req, res) {

        var id = req.params.newid;
        console.log('id:' + id);

        let selectQuery = 'SELECT * FROM news where newid = ?';
        let query = mysql.format(selectQuery, [id]);

        db.query(query, (err, results) => {

            console.log(results);
                res.render('news-details', {
                    layout: 'main',
                    data: {
                        news: results[0]
                    },
                    websiteURL: websiteURL
                });
                if (err) console.log(err);
            }
        );

    },

    productFunction: function (req, res) {

        var index = req.params.index;
        var categoryType = req.params.type;
        var max = index * 6;
        var start = max - 6;

        db.query('SELECT * FROM product where type = ' + categoryType + ' order by productID desc limit ' + start + ', 6 ; select count(*) as count from product where type = ' + categoryType +' ; select * from productType;',
            function (err, results) {
                //console.log(results[1]);
                res.render('product', {
                    layout: 'main',
                    data: {
                        page_name: 'product',
                        product: results[0],
                        count: results[1][0].count,
                        offset: 6,
                        current: index,
                        type: "product",
                        category: results[2],
                        categoryType: categoryType
                    },
                    websiteURL: websiteURL
                });
                if (err) console.log(err);
            }
        );

    },

    productDetailsFunction: function (req, res) {

        var id = req.params.id;

        let selectQuery = 'SELECT * FROM product where productID = ?';
        let query = mysql.format(selectQuery, [id]);

        db.query(query, (err, results) => {

            console.log(results);
            res.render('product-details', {
                layout: 'main',
                data: {
                    product: results[0]
                },
                websiteURL: websiteURL
            });
            if (err) console.log(err);
        }
        );

    },

    // SERVER

    adminNews: function (req, res) {

        db.query('SELECT newid, title, description, DATE_FORMAT(date, "%d/%m/%Y %h:%i %p") as date FROM news order by newid desc;',
            function (err, results) {
                //console.log(results[1]);
                res.render('admin/admin-news', {
                    layout: 'admin-main',
                    data: {
                        product: results,
                    },
                    websiteURL: websiteURL
                });
                if (err) console.log(err);
            }
        );

    },

    adminNewsAdd: function (req, res) {

        res.render('admin/admin-newsadd', {
            layout: 'admin-main',
            websiteURL: websiteURL
        });

    },

    adminNewsDetails: function (req, res) {

        //console.log("vao day");
        //console.log(req.params.newid);
        let select = 'select * from news where newid = ?';
        let query = mysql.format(select, [req.params.newid]);
        db.query(query, (err, result) => {

            //if (err) {
            //}
            //else {
                console.log(result);
                res.render('admin/admin-newsdetails', {
                layout: 'admin-main',
                data: {
                    news: result[0]
                },
                    websiteURL: websiteURL
                });
            //}
        });

    },

    adminType: function (req, res) {

        db.query('SELECT * FROM producttype;',
            function (err, results) {
                res.render('admin/admin-type', {
                    layout: 'admin-main',
                    data: {
                        type: results,
                    },
                    websiteURL: websiteURL
                });
                if (err) console.log(err);
            }
        );

    },

    adminProduct: function (req, res) {

        db.query('SELECT * FROM productType;',
            function (err, results) {
                res.render('admin/admin-product', {
                    layout: 'admin-main',
                    data: {
                        type: results,
                    },
                    websiteURL: websiteURL
                });
                if (err) console.log(err);
            }
        );

    },

    adminProductDetails: function (req, res) {

        //console.log("vao day");
        //console.log(req.params.newid);
        let select = 'select * from product where productID = ?; select * from productType;';
        let query = mysql.format(select, [req.params.productID]);
        db.query(query, function (err, result) {

            console.log(result[0]);
            console.log(result[1]);

            res.render('admin/admin-productdetails', {
                layout: 'admin-main',
                data: {
                    product: result[0][0],
                    type: result[1]
                },
                websiteURL: websiteURL
            });

        });

    },

    adminContact: function (req, res) {

        db.query('SELECT contactID, company, country, name, DATE_FORMAT(date, "%d/%m/%Y %h:%i %p") as date, isRead FROM contact order by contactID desc;',
            function (err, results) {
                res.render('admin/admin-contact', {
                    layout: 'admin-main',
                    data: {
                        contact: results,
                    },
                    websiteURL: websiteURL
                });
                if (err) console.log(err);
            }
        );

    },

    adminContactDetails: function (req, res) {

        //console.log("vao day");
        //console.log(req.params.newid);
        let select = 'select * from contact where contactID = ?';
        let query = mysql.format(select, [req.params.contactID]);
        db.query(query, (err, result) => {

            //if (err) {
            //}
            //else {
            console.log(result);
            res.render('admin/admin-contactdetails', {
                layout: 'admin-main',
                data: {
                    contact: result[0]
                },
                websiteURL: websiteURL
            });
            //}
        });

    },


    // API

    newsInsert: function (req, res) {

        let insertQuery = 'INSERT INTO news (title, content, date, image, description) VALUES(?, ?, now(), ?, ?)';
        let query = mysql.format(insertQuery, [req.body.title, req.body.content, req.body.image, req.body.description]);
        db.query(query, (err, response) => {
            if (err) {
                console.error(err);
                return;
            }
        });

        res.status(200).send(JSON.stringify({ status: "OK" }));
    },

    newsUpdate: function (req, res) {

        let updateQuery = 'update news set title = ?, content = ?, date = now(), image = ?, description = ? where newid = ?';
        let query = mysql.format(updateQuery, [req.body.title, req.body.content, req.body.image, req.body.description, req.body.newid]);
        db.query(query, (err, response) => {
            if (err) {
                console.error(err);
                return;
            }
        });

        res.status(200).send(JSON.stringify({ status: "OK" }));
    },

    newsDelete: function (req, res) {
        //console.log('Q Delete');
        //console.log(req.body);

        let deleteQuery = 'DELETE FROM news WHERE newid = ?';
        let query = mysql.format(deleteQuery, [req.body.newid]);
        db.query(query, (err, response) => {
            if (err) {
                console.error(err);
                return;
            }
        });

        res.status(200).send(JSON.stringify({ status: "OK" }));

    },

    authen: function (request, response) {
        console.log(request.body);
        var username = request.body.username;
        var password = request.body.password;
        if (username && password) {
            db.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
                if (results.length > 0) {
                    request.session.loggedin = true;
                    request.session.username = username;
                    
                    let token = jwt.sign({ "body": "stuff" }, config.secret, { algorithm: 'HS256' });

                    // using cookie
                    response.cookie("token", token, { maxAge: 600 * 1000 }, { httpOnly: true });

                    // using author
                    response.json({
                        success: true,
                        message: 'Authentication successul',
                        //token: token,
                        redirect: '/admin'
                    });
                    //response.redirect('/admin');
                    //response.end();
                    
                } else {
                    //response.json({
                    //    success: false,
                    //    message: 'Authentication failed',
                    //    token: token
                    //})
                    response.status(401).end()
                }
                //response.end();
            });
        } else {
            response.send('Please enter Username and Password!');
            response.end();
        }
    },

    changePass: function (req, res) {

        console.log('Change pass');
        //console.log('Update Data: ' + req.body.oldpass);
        //console.log('Update Data: ' + req.body.newpass);

        let updateQuery = 'update user set password = ? where password = ?';
        let query = mysql.format(updateQuery, [req.body.newpass, req.body.oldpass]);
        console.log(query);

        db.query(query, (err, result) => {

            console.log(result);
            console.log(result.affectedRows);

            if (result.affectedRows > 0) {
                console.log('OK');
                res.status(200).send(JSON.stringify({ status: "OK" }));
            }
            else {
                console.log('ERROR');
                res.status(201).send(JSON.stringify({ status: "WRONG" }));
            }

            if (err) {
                console.error(err);
                res.status(500).send(JSON.stringify({ status: "ERROR" }));
                return;
            }
        });

        //console.log(req.body.status);
        //res.status(200).send(JSON.stringify({ status: "OK" }));

    },

    typeInsert: function (req, res) {

        let insertQuery = 'INSERT INTO productType (name) VALUES(?)';
        let query = mysql.format(insertQuery, [req.body.name]);
        db.query(query, (err, response) => {
            if (err) {
                console.error(err);
                return;
            }
        });

        res.status(200).send(JSON.stringify({ status: "OK" }));
    },

    typeUpdate: function (req, res) {

        console.log('da vao update');

        let updateQuery = 'update productType set name = ? where productTypeID = ?';
        let query = mysql.format(updateQuery, [req.body.name, req.body.productTypeID]);
        db.query(query, (err, response) => {
            if (err) {
                console.error(err);
                return;
            }
        });

        res.status(200).send(JSON.stringify({ status: "OK" }));
    },

    typeDelete: function (req, res) {

        let deleteQuery = 'DELETE FROM productType where productTypeID = ?';
        let query = mysql.format(deleteQuery, [req.body.typeid]);
        db.query(query, (err, response) => {
            if (err) {
                console.error(err);
                return;
            }
        });

        res.status(200).send(JSON.stringify({ status: "OK" }));

    },

    productInsert: function (req, res) {

        let insertQuery = 'INSERT INTO productType (name) VALUES(?)';
        let query = mysql.format(insertQuery, [req.body.name]);
        db.query(query, (err, response) => {
            if (err) {
                console.error(err);
                return;
            }
        });

        res.status(200).send(JSON.stringify({ status: "OK" }));
    },

    productSelect: function (req, res) {

        let selectQuery = 'select productID, name, description from product where type = ? order by productID desc';
        let query = mysql.format(selectQuery, [req.body.type]);
        db.query(query, (err, result) => {
            if (err) {
                console.error(err);
                return;
            }
            res.status(200).send(JSON.stringify({ product: result }));
        });

        
    },

    productUpdate: function (req, res) {

        let updateQuery = 'update product set name = ?, type = ?, image = ?, description = ?, content = ?, thumb1 = ?, thumb2 = ?, thumb3 = ? where productID = ?';
        let query = mysql.format(updateQuery, [req.body.name, req.body.type, req.body.image, req.body.description, req.body.content, req.body.tb1, req.body.tb2, req.body.tb3, req.body.productID]);
        db.query(query, (err, response) => {
            if (err) {
                console.error(err);
                return;
            }
        });

        res.status(200).send(JSON.stringify({ status: "OK" }));
    },

    productDelete: function (req, res) {

        let deleteQuery = 'DELETE FROM product where productID = ?';
        let query = mysql.format(deleteQuery, [req.body.productID]);
        db.query(query, (err, response) => {
            if (err) {
                console.error(err);
                return;
            }
        });

        res.status(200).send(JSON.stringify({ status: "OK" }));

    },

    contactDelete: function (req, res) {

        let deleteQuery = 'DELETE FROM contact where contactID = ?';
        let query = mysql.format(deleteQuery, [req.body.contactID]);
        db.query(query, (err, response) => {
            if (err) {
                console.error(err);
                return;
            }
        });

        res.status(200).send(JSON.stringify({ status: "OK" }));

    },

    contactRead: function (req, res) {

        let deleteQuery = 'update contact set isRead = 1 where contactID = ?';
        let query = mysql.format(deleteQuery, [req.body.contactID]);
        db.query(query, (err, response) => {
            if (err) {
                console.error(err);
                return;
            }
        });

        res.status(200).send(JSON.stringify({ status: "OK" }));

    },

    mediaInsert: function (req, res) {

        let deleteQuery = 'insert into media (source, productID, mediaType) values (?,?,?)';
        let query = mysql.format(deleteQuery, [req.body.source, req.body.productID, req.body.mediaType]);
        db.query(query, (err, response) => {
            if (err) {
                console.error(err);
                return;
            }
        });

        res.status(200).send(JSON.stringify({ status: "OK" }));

    },

    errorHandle: function (err, req, res, next) {
        if (typeof (err) === 'string') {
            // custom application error
            return res.status(400).json({ message: err });
        }

        if (err.name === 'UnauthorizedError') {
            // jwt authentication error
            return res.status(401).json({ message: 'Invalid Token' });
        }

        // default to 500 server error
        return res.status(500).json({ message: err.message });
    }
}

