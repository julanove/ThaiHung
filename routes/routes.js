var mysql = require('mysql');
var env = process.env.NODE_ENV || 'local';
var config = require('../config/config')[env];
const jwt = require('jsonwebtoken');


module.exports = {
    homePageFunction: function (req, res) {

        console.log('Home URL');
        console.log(websiteURL);

        db.query('SELECT * FROM media where mediaType = 1 limit 8; SELECT * FROM news order by newID desc limit 4;select about from about;',
            function (err, results) {
                console.log("=================x===========");
                //console.log(results[2].about);
                //console.log(results[2][0].about);
                res.render('home', {
                    page_name: 'home',
                    layout: 'main',
                    data: {
                        media: results[0],
                        news: results[1],
                        about: results[2][0].about,
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

        let insertQuery = 'INSERT INTO contact (company, content, country, date, isRead, name, phone, email) VALUES(?, ?, ?, now(), 0, ?, ?, ?)';
        let query = mysql.format(insertQuery, [req.body.company, req.body.content, req.body.country, req.body.name, req.body.phone, req.body.email]);
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


    aboutFunction: function (req, res) {

        let selectQuery = 'SELECT * FROM about';
        let query = mysql.format(selectQuery, null);

        console.log('ABOUT');

        db.query(query, (err, results) => {

            console.log(results[0]);
            res.render('about', {
                layout: 'main',
                data: {
                    about: results[0]
                },
                websiteURL: websiteURL
            });
            if (err) console.log(err);
        }
        );

    },

    facilityFunction: function (req, res) {

        let selectQuery = 'SELECT video FROM about;SELECT * FROM facility';
        let query = mysql.format(selectQuery, null);

        db.query(query, (err, results) => {

            console.log(results[0]);
            console.log(results[1]);
            res.render('facility', {
                layout: 'main',
                data: {
                    about: results[0][0],
                    facility: results[1][0]
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

    adminProductAdd: function (req, res) {

        let select = 'select * from productType;';
        let query = mysql.format(select, null);
        db.query(query, function (err, result) {

            res.render('admin/admin-productadd', {
                layout: 'admin-main',
                data: {
                    type: result
                },
                websiteURL: websiteURL
            });

        });

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

    adminAbout: function (req, res) {

        db.query('select * from about;',
            function (err, results) {

                console.log(results);

                res.render('admin/admin-about', {
                    layout: 'admin-main',
                    data: {
                        about: results[0],
                    },
                    websiteURL: websiteURL
                });
                if (err) console.log(err);
            }
        );
    },

    adminFacility: function (req, res) {

        db.query('select * from facility;',
            function (err, results) {

                console.log(results);

                res.render('admin/admin-facility', {
                    layout: 'admin-main',
                    data: {
                        about: results[0],
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
                    response.cookie("token", token, { maxAge: 365 * 24 * 60 * 60 * 1000 }, { httpOnly: true });

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

        let insertQuery = 'INSERT INTO product (content, description, image, name, thumb1, thumb2, thumb3, type) VALUES (?, ?, ?, ? , ?, ?, ?, ?)';
        let query = mysql.format(insertQuery, [req.body.content, req.body.description, req.body.image, req.body.name, req.body.tb1, req.body.tb2, req.body.tb3, req.body.type]);
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

    aboutUpdate: function (req, res) {

 
        let updateQuery = 'update about set about = ?, daihyou = ?, gyoumu = ?, honsha_location = ?, image = ?, insu = ?, koujou = ?, renrakusaki = ?, shamei = ?, shihon = ?, strongpoint = ?, video = ?, imageRep1 = ?, repName1 = ?, repPos1 = ?, repDes1 = ?, imageRep3 = ?, repName3 = ?, repPos3 = ?, repDes3 = ?, middleBanner = ?, roundBanner = ?, footerImage1 = ?, footerImage2 = ?, middleBannerD = ?';
        let query = mysql.format(updateQuery, [req.body.about, req.body.daihyou, req.body.gyoumu, req.body.honsha_location, req.body.image, req.body.insu, req.body.koujou, req.body.renrakusaki, req.body.shamei, req.body.shihon, req.body.strongpoint, req.body.video, req.body.imageRep1, req.body.rep1Name, req.body.rep1Pos, req.body.rep1Des, req.body.imageRep3, req.body.rep3Name, req.body.rep3Pos, req.body.rep3Des, req.body.middleBanner, req.body.roundBanner, req.body.footerImage1, req.body.footerImage2, req.body.middleBannerD]);
        db.query(query, (err, response) => {
            if (err) {
                console.error(err);
                return;
            }
        });

        res.status(200).send(JSON.stringify({ status: "OK" }));
    },

    facilityUpdate: function (req, res) {

        try {

            console.log('Update Facility');
            console.log(req.body);
            let updateQuery = 'update facility set about = ?, fac1 = ?, image1 = ?, f11 = ?, f12 = ?, f13 = ?, f14 = ?, f15 = ?, f16 = ?, fac2 = ?, image2 = ?, f21 = ?, f22 = ?, f23 = ?, f24 = ?, f25 = ?, f26 = ?';
            let query = mysql.format(updateQuery, [req.body.about, req.body.fac1, req.body.image1, req.body.f11, req.body.f12, req.body.f13, req.body.f14, req.body.f15, req.body.f16, req.body.fac2, req.body.image2, req.body.f21, req.body.f22, req.body.f23, req.body.f24, req.body.f25, req.body.f26]);
            console.log(query);
            db.query(query, (err, response) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('UPDATE OK');
            });

            res.status(200).send(JSON.stringify({ status: "OK" }));
        }
        catch (ex) {
            console.error(ex);
        }
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

