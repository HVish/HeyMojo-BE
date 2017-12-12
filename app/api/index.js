'use strict';

const router = require('express').Router();
const org = require('./organizations');

router.use(org);

module.exports = router;