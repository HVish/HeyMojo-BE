'use strict';

const express = require('express');
const bodyParser = require('body-parser');

// initalize services
const config = require('./config');
const log = require('./app/services/log').init(config.local);
const db = require('./app/services/db').init(config.db);

const app = express();
const api = require('./app/api');


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// api routes
app.use('/', api);

// start the server
app.listen(config.local.port, err => {
    if (err) {
        return log.error(err);
    }
    log.info(`===================================`);
    log.info(`Server started!!`);
    log.info(`environment: ${config.local.env}`);
    log.info(`port: ${config.local.port}`);
    log.info(`===================================`);

});
