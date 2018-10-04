'use strict';
const winston = require('winston');
const fs = require('fs');
const tsFormat = () => (new Date()).toLocaleDateString() + ' - ' + (new Date()).toLocaleTimeString();
const logDir = 'logs';

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const config = {
    levels: {
        error: 0,
        debug: 1,
        warn: 2,
        info: 4,
        verbose: 5,
        silly: 6
    },
    colors: {
        error: 'red',
        debug: 'blue',
        warn: 'yellow',
        info: 'green',
        verbose: 'cyan',
        silly: 'magenta'
    }
};

// define the custom settings for each transport (file, console)
var options = {
    file: {
        level: 'silly',
        timestamp: tsFormat,
        filename: `${logDir}/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        format: winston.format.combine(
            winston.format.align(),
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            winston.format.printf(silly => `${silly.timestamp} ${silly.level}: ${silly.message}`)
        )
    },
    console: {
        level: 'info',
        timestamp: tsFormat,
        handleExceptions: true,
        json: true,
        colorize: true,
        format: winston.format.combine(
            winston.format.align(),
            winston.format.colorize(),
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
        )
    },
};

// instantiate a new Winston Logger
var logger = winston.createLogger({
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
});

module.exports = logger;