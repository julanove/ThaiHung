const expressJwt = require('express-jwt');
const jw2t = require('jsonwebtoken');

var env = process.env.NODE_ENV || 'local';
var config = require('../config/config')[env];

module.exports = jwt;

function jwt(req, res) {
    console.log('jwt');
    const { secret } = config;
    console.log(secret);
    //console.log(expressJwt({ secret, algorithms: ['HS256'] }));
    //return expressJwt({ secret, algorithms: ['HS256'] }).unless({
    //    path: [
    //        // public routes that don't require authentication
    //        '/auth',
    //        '/contact'
    //    ]
    //});
    let token = jw2t.sign({ "body": "stuff" }, secret, { algorithm: 'HS256' });
    res.send(token);
}