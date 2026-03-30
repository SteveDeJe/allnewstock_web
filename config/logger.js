const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const logDir = 'log';
const { combine, timestamp, printf, colorize } = winston.format;

const config = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'blue'
    }
}

winston.addColors(config.colors);

const logger = new winston.createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        printf(info => {
            return `[${info.timestamp}][${info.level}] : ${info.message}`;
        }),
    ),
    transports: [
        // console
        new winston.transports.Console({
            format: combine(colorize({ all: true })),
        }),
        // silly 이 제일 낮음 
        new winstonDaily({
            level: 'silly',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: `console.log.%DATE%`,
            maxFiles: 30, // 30 days
        }),
        // error 
        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: `error.log.%DATE%`,
            maxFiles: 30, // 30 days
        })
    ]
})

const logFormat = {
    reqFormat: (req, res, data) => {
        return `
          Request:
            Method: ${req.method}
            URL: ${req.url}
            Headers: ${JSON.stringify(req.headers)}
            Body: ${JSON.stringify(data)}
          Response:
            URL: ${res.url}
            Status: ${res.statusCode}
            Headers: ${JSON.stringify(res.headers)}
        `;
    },

}

module.exports = { logger, logFormat };