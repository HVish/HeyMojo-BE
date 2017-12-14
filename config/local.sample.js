'use strict';

module.exports = {
    logLevel: 'debug', // error, warn, info, verbose, debug, silly
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    db: {
        host: '',
        port: 27017,
        database: ''
    },
    aws: {
        key: '',
        secret: '',
        region: '',
        bucket: '',
        uploadPath: ''
    }
};