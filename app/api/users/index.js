'use strict';

const crypto = require('crypto');
const router = require('express').Router();

const local = require('../../../config').local;
const Users = require('./users.model');
const template = require('./reset.template');

const log = require('../../services/log').logger;
const emailer = require('../../services/emailer');

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
        user.email = data.email;
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

router.route('/users/:username/reset')
    // validate reset password url and get username
    .get((req, res) => {
        const username = req.params.username;
        const resetToken = req.query.token;
        Users.findOne({ username, resetToken }).then(user => {
            if (user) {
                res.json({ username });
            } else {
                res.status(403).json({ message: "Invalid reset url" });
            }
        }).catch(err => {
            log.error(err);
            return res.status(500).json({ message: 'Unable to verify username ' });
        });
    })
    // validate user and send password reset link to email
    .post((req, res) => {
        const username = req.params.username;

        log.verbose(`POST /users/${username}/reset`);
        Users.findOne({ username }).then(user => {
            if (!user) {
                throw new Error('Invalid username');
            } else {
                const resetToken = crypto.createHash('md5').update(username + Date.now()).digest("hex")
                return Users.findOneAndUpdate(
                    { username },
                    { resetToken },
                    { new: true }
                );
            }
        }).then(user => {
            const data = {
                name: user.name.first + ' ' + user.name.last,
                url: `${local.baseUrl}/reset;token=${user.resetToken};username=${user.username}`
            };
            return emailer.sendMail(user.email, "Password Reset Link", template(data));
        }).then(() => {
            return res.json({ message: 'Reset link mailed' });
        }).catch(err => {
            if (err.message == "Invalid username") {
                return res.status(403).json({ message: 'Invalid username' });
            } else {
                console.error(err);
                return res.status(500).json({ message: "Unable to send reset link to your email" });
            }
        });
    })
    .put((req, res) => {
        const username = req.params.username;
        const resetToken = req.body.resetToken;
        const password = crypto.createHash('md5').update(req.body.password).digest("hex");

        log.verbose(`PUT /users/${username}/reset:` + JSON.stringify({ username, resetToken, password }));
        Users.findOneAndUpdate(
            { username, resetToken },
            { password, resetToken: null }
        ).then(user => {
            if (user) {
                res.json({ message: "Successfully updated" });
            } else {
                res.status(403).json({ message: "Invalid request" });
            }
        }).catch(err => {
            log.error(err);
            return res.status(500).json({ message: 'Unable to reset password' });
        });
    });

module.exports = router;