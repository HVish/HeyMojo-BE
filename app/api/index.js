'use strict';

const router = require('express').Router();
const org = require('./organizations');
const user = require('./users');
const s3 = require('../services/aws');
const log = require('../services/log').logger;

router.use(org);
router.use(user);

router.get('/s3/upload-url', function (req, res) {
    const file = {
        name: req.query.name,
        type: req.query.type,
        size: req.query.size
    };
    log.verbose("GET /s3/upload-url", JSON.stringify(file));
    if (!(file.name && file.type && file.size)) {
        return res.status(400).json({ message: 'invalid attributes' });
    }
    return res.json(s3.preUrl(s3.uploadPath, file));
});

router.get('/s3/image-url', function (req, res) {
    const name = req.query.name;
    log.verbose("GET /s3/upload-url", JSON.stringify(req.query));
    if (!name) {
        return res.status(400).json({ message: 'invalid name' });
    }
    return res.json({
        url: s3.url(s3.uploadPath + '/' + name)
    });
});

module.exports = router;