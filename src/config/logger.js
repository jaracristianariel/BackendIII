import path from 'path';
import { fileURLToPath } from 'url';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import config from './env.config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(__dirname, '../../logs');

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'red bold',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'blue',
    },
};

winston.addColors(customLevels.colors);

const consoleFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
        return `${timestamp} [${level}]: ${stack ?? message}`;
    }),
);

const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.json(),
);

const isProduction = config.NODE_ENV === 'production';

const logger = winston.createLogger({
    levels: customLevels.levels,
    level: isProduction ? 'info' : 'debug',
    transports: [
        new winston.transports.Console({
            format: consoleFormat,
        }),
        new DailyRotateFile({
            dirname: logsDir,
            filename: 'error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            format: fileFormat,
            maxFiles: '14d',
        }),
        new DailyRotateFile({
            dirname: logsDir,
            filename: 'info-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'info',
            format: fileFormat,
            maxFiles: '14d',
        }),
    ],
});

export default logger;