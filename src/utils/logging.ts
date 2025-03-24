import winston from 'winston';
import path from 'path';

const levels = {
error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
};


winston.addColors(colors);


const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
);


const transports = [
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({ 
      filename: path.join('logs', 'combined.log') 
    }),
];


const logger = winston.createLogger({
    level:'info',
    levels,
    format,
    transports,
});
  
export default logger;