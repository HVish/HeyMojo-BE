'use strict';

const nodemailer = require('nodemailer');
const bluebird = require('bluebird');
const local = require('../../config').local;

module.exports = {
    nodemailer: nodemailer,
    // call this before using any other functions
    init: function () {
        return this.transporter = nodemailer.createTransport({
            host: local.mail.host,
            port: local.mail.port,
            secure: false, // use SSL
            tls: {
                rejectUnauthorized: false
            },
            auth: {
                user: local.mail.user,
                pass: local.mail.pass
            }
        });
    },
    sendMail: function (to, subject, html) {
        // check if transporter initialized
        if (!this.transporter) {
            this.init();
        }

        const mailOptions = { to, subject, html };
        mailOptions.from = local.mail.from;

        this.transporter.sendMail(mailOptions);
    }
}
