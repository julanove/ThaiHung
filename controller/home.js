﻿const fs = require('fs');

exports.getHomePage = (req, res) => {
    let query = "SELECT * FROM `players` ORDER BY id ASC"; // query database to get all the players

    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.error(err.stack);
            res.status(500);
            res.render('500');
        }

        res.render('index.ejs', {
            title: "Welcome to Socka | View Players",
            players: result
        });
    });
};
