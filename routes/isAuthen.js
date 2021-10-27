var env = process.env.NODE_ENV || 'local';
var config = require('../config/config')[env];
const { secret } = config;
const jwt = require('jsonwebtoken');

module.exports = {
    isAuthenticated: function (req, res, next) {
        /*
        if (typeof req.headers.authorization !== "undefined") {
            // retrieve the authorization header and parse out the
            // JWT using the split function
            let token = req.headers.authorization.split(" ")[1];
            jwt.verify(token, secret, { algorithm: "HS256" }, (err, user) => {
         */

        if (req.cookies && typeof req.cookies["token"] === "undefined") {
            res.status(401).json({ error: "Not Authorized" });


        }
        else {
            var token = req.cookies["token"];
            if (!token) {
                return res.status(401).end() 
            }

            jwt.verify(token, secret, { algorithm: "HS256" }, (err, user) => {

                if (err) {
                    res.status(401).json({ error: "Not Authorized" });
                    throw new Error("Not Authorized");
                }
                // if the JWT is valid, allow them to hit
                // the intended endpoint
                //res.send(`Welcome ${payload.username}!`)
                return next();
            });
        }

        // if the cookie is not set, return an unauthorized error
        // Finally, return the welcome message to the user, along with their
        // username given in the token
    }
}