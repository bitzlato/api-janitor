import winston from "winston";
import { LoggerLevel } from "./types";

const { combine, timestamp, label, printf } = winston.format

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level} ${message}`;
});

const Logger = winston.createLogger({
    level: LoggerLevel.INFO,
    format: combine(
        winston.format.colorize(),
        label({ label: 'janitor' }),
        timestamp(),
        myFormat
    ),
    transports: [
        new winston.transports.File({
            filename: 'log/logfile',
            level: LoggerLevel.ERROR,
        }),
        new winston.transports.File({
            filename: 'log/logfile',
            level: LoggerLevel.INFO,
        }),
        new winston.transports.File({
            filename: 'log/logfile',
            level: LoggerLevel.DEBUG,
        }),
        new winston.transports.Console()
    ],
})

export default Logger
