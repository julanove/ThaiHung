var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: '< MySQL username >',
    password: '< MySQL password >',
    database: '<your database name>'
});

connection.connect();

connection.query('SELECT * from < table name >', function (err, rows, fields) {
    if (!err)
        console.log('The solution is: ', rows);
    else
        console.log('Error while performing Query.');
});

connection.end();