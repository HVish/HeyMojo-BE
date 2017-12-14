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

    Users
        .findOne({ username, password })
        .populate('education')
        .populate('work')
        .then(user => {
            if (!user) return res.status(401).json({
                message: 'Wrong credentials '
            });
            return res.json(user);
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ message: err.message });
        });
});

router.route('/users')
    // create user
    .post((req, res) => {
        const user = new Users();
        const data = req.body;

        log.verbose('POST /users: ' + JSON.stringify(data));

        user.name.first = data.firstName;
        user.name.last = data.lastName;
        user.dob = new Date(data.dob);
        user.password = data.password;
        user.username = data.username;
        user.profilePic = data.profilePic;

        user.save().then(created => {
            return res.status(201).json(created);
        }).catch(err => {
            log.error(err);
            return res.status(500).json({
                message: err.message
            });
        });
    });

module.exports = router;