'use strict';

const router = require('express').Router();
const org = require('./organizations');
const user = require('./users');

router.use(org);
router.use(user);

module.exports = router;