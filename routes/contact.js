﻿module.exports = {
    contact: (request, response) => {
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
};