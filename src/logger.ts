import { createLogger, format, transports } from 'winston';

// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston

let loggerTransports: any = [
  new transports.Console({
    level: 'debug',
    format: format.combine(
      format.colorize(),
      format.timestamp(),
      format.splat(),
      format.simple()
      // format.printf(({ level, message, timestamp }) => {
      //   return `${timestamp} ${level}: ${message}`;
      // })
    ),
  }),
];

if (process.env.NODE_ENV !== 'test') {
  loggerTransports.push(
    new transports.File({
      filename: 'logs/logs.log',
      level: 'info',
      format: format.combine(format.timestamp(), format.splat(), format.json()),
    })
  );
}

const logger = createLogger({
  // To see more detailed errors, change this to 'debug'
  transports: loggerTransports,
});

export default logger;
