var mysql = require('mysql');

module.exports = {
    homePageFunction: function (req, res) {
        db.query('SELECT * FROM media where mediaTypeID = 1 limit 8; SELECT * FROM news order by newID desc limit 4;',
            function (err, results) {
                //connection.release();
                res.render('home', {
                    layout: 'main',
                    data: {
                        media: results[0],
                        news: results[1],
                    }
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
        db.query('SELECT * FROM news order by newID desc limit 2; select count(*) as count from news;',
            function (err, results) {
                //console.log(results[1][0].count);
                res.render('news', {
                    layout: 'main',
                    data: {
                        news: results[0],
                        count: results[1][0].count,
                        offset: 2,
                        current: 1,
                        type: "news"
                    }
                });
                if (err) console.log(err);
            }
        );

    },

    newsPagingFunction: function (req, res) {

        var index = req.params.index;
        var max = index * 2; 
        var start = max - 2; 

        //console.log('start:');
        //console.log(start);

        //console.log('max:');
        //console.log(max);

        db.query('SELECT * FROM news order by newID desc limit ' + start + ', 2 ; select count(*) as count from news;' ,
            function (err, results) {
                //console.log(results[1]);
                res.render('news', {
                    layout: 'main',
                    data: {
                        news: results[0],
                        count: results[1][0].count,
                        offset: 2,
                        current: index,
                        type: "news"
                    }
                });
                if (err) console.log(err);
            }
        );

    },

    newsDetailsFunction: function (req, res) {

        var id = req.params.id;
        console.log('id:' + id);

        let selectQuery = 'SELECT * FROM news where newid = ?';
        let query = mysql.format(selectQuery, [id]);

        db.query(query, (err, results) => {

            console.log(results);
                res.render('news-details', {
                    layout: 'main',
                    data: {
                        news: results[0]
                    }
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
                    }
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
                }
            });
            if (err) console.log(err);
        }
        );

    },
}