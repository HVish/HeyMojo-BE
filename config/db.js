'use strict';

const local = require('./local');

module.exports = {
    host: local.db.host,
    port: local.db.port,
    database: local.db.database,
    useMongoClient: true
};