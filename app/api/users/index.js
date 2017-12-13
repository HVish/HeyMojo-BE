'use strict';

const crypto = require('crypto');
const router = require('express').Router();
const Users = require('./users.model');
const log = require('../../services/log').logger;

router.route('/auth').post((req, res) => {
    log.verbose('POST /auth: ' + JSON.stringify(req.body));

    if (!(req.body.username && req.body.password)) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    const username = req.body.username;
    const password = crypto.createHash('md5').update(req.body.password).digest("hex");

    Users.findOne({ username, password }).then(user => {
        if (!user) return res.status(401).json({
            message: 'Wrong credentials '
        });
        return res.json(user);
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ message: err.message });
    });
});

module.exports = router;