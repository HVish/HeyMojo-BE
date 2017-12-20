'use strict';

module.exports = {
    logLevel: 'debug', // error, warn, info, verbose, debug, silly
    baseUrl: '', // No trailing slashes
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
    },
    mail: {
        host: '',
        port: 587,
        user: '',
        pass: '',
        from: '"Your Name" <your email>'
    }
};