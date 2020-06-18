module.exports = {
    adminAuthenticate: (request, response) => {
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
};