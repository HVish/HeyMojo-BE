'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const api = require('./api');
const config = require('./config');
const log = require('./log')(config.local);

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
