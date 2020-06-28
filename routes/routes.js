var mysql = require('mysql');


module.exports = {
    homePageFunction: function (req, res) {

        console.log('Home URL');
        console.log(websiteURL);

        db.query('SELECT * FROM media where mediaTypeID = 1 limit 8; SELECT * FROM news order by newID desc limit 4;',
            function (err, results) {
                //connection.release();
                res.render('home', {
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
        var max = index * 3;
        var start = max - 3;

        db.query('SELECT * FROM product where type = ' + categoryType + ' order by productID desc limit ' + start + ', 3 ; select count(*) as count from product where type = ' + categoryType +' ; select * from productType;',
            function (err, results) {
                //console.log(results[1]);
                res.render('product', {
                    layout: 'main',
                    data: {
                        product: results[0],
                        count: results[1][0].count,
                        offset: 3,
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

    authen: function (request, response) {
        var username = request.body.username;
        var password = request.body.password;
        if (username && password) {
            db.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
                if (results.length > 0) {
                    request.session.loggedin = true;
                    request.session.username = username;
                    response.redirect('/admin');
                } else {
                    response.send('Incorrect Username and/or Password!');
                }
                response.end();
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

    imageUpload: function (req, res) {

        //console.log(req.body);
        //console.log('IMAGE IN');
        //console.log(req.body.imageFile);

        //console.log(req.files.imageFile.path);
        //console.log(req.files.imageFile.type);

        //var file = __dirname + "/" + req.files.file.name;
        //fs.readFile(req.files.file.path, function (err, data) {
        //    fs.writeFile(file, data, function (err) {
        //        if (err) {
        //            console.log(err);
        //        } else {
        //            response = {
        //                message: 'File uploaded successfully',
        //                filename: req.files.file.name
        //            };
        //        }
        //        console.log(response);
        //        res.end(JSON.stringify(response));
        //    });
        //});
    },

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

    }
}