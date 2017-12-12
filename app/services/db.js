'use strict';

const mongoose = require('mongoose');
const bluebird = require('bluebird');

module.exports = {
    db: mongoose,
    init: function (config) {
        const url = `mongodb://${config.host}:${config.port}/${config.database}`;
        mongoose.Promise = bluebird;
        mongoose.connect(url, { useMongoClient: config.useMongoClient });
        return this.db;
    }
}