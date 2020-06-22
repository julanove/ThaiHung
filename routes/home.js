//module.exports = {
//    getHomePage: (req, res) => {

//        let query = "SELECT * FROM media where mediaTypeID = 1"; 

//        db.query(query, (err, result) => {

//            if (err) {
//                console.error(err.message);
//                res.status(500);
//                res.render('500');
//            }

//            console.log(result);
//            res.render('home', {
//                layout: 'main',
//                rows:result,
//                developerName: "jula",
//                countryName: "VN"
//            });
//        }); 
//    },
//};

//module.exports = {
//    getHomePage: (req, res) => {
//        let query = "SELECT * FROM media"; 

//        db.query(query, (err, result) => {
//            if (err) {
//                res.redirect('/');
//            }
//            res.render('index.ejs', {
//                title: "Welcome to Socka | View Players"
//                , players: result
//            });
//    });
//},
//};

//module.exports = {
//    getHomePage: (req, res) => {

//        let query = "SELECT * FROM media where mediaTypeID = 1 limit 8";

//        db.query(query, (err, result) => {

//            if (err) {
//                console.error(err.message);
//                res.status(500);
//                res.render('500');
//            }

//            else {
//                res.render('home', {
//                    layout: 'main',
//                    rows: result,
//                    developerName: "jula",
//                    countryName: "VN"
//                });
//            }
//        });
//    },
//};




async function executeQuery(query, params) {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, result) => {
            if (err) { return reject(err); }

            return resolve(result);
        });
    });
}

module.exports = {
    getHomePage: (req, res) => {

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
};


