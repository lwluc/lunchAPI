const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, prettyPrint } = format;

const myFormat = printf(info => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

const loggerConfig = createLogger({
  format: combine(
    colorize(),
    timestamp(),
    prettyPrint(),
    myFormat,
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'server.log' }),
    new transports.File({ filename: 'error.log', level: 'error', format: format.json() }),
  ]
});

export const logger = loggerConfig;
