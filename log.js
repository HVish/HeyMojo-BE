'use strict';

const { createLogger, format, transports } = require('winston');
const { combine, colorize, timestamp, printf } = format;

const customFormat = printf(info => {
    return `[${info.timestamp}] ${info.level}: ${info.message}`;
});

module.exports = function (config) {
    const logger = createLogger({
        level: config.logLevel || 'info',
        format: combine(timestamp(), format.json()),
        transports: [
            // Write all logs error (and below) to `error.log`.
            new transports.File({ filename: 'error.log', level: 'error' }),
            // Write to all logs with level `info` and below to `combined.log` 
            new transports.File({ filename: 'combined.log' })
        ],
    });

    // If we're not in production then log to the `console` with the format:
    if (config.env !== 'production') {
        logger.add(new transports.Console({
            colorize: true,
            format: combine(colorize(), timestamp(), customFormat)
        }));
    }
    return logger;
}