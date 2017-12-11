'use strict';

module.exports = {
    logLevel: 'info', // error, warn, info, verbose, debug, silly
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
};