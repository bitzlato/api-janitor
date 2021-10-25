import winston from "winston";
import { LoggerLevel } from "./types";

const { combine, timestamp, label, printf } = winston.format

const myFormat = printf(({ level, message, label, timestamp, stack }) => {
    if (stack) {
        return `${timestamp} [${label}] ${level} ${message} ${stack && '\n'.concat(stack)}`
    }

    return `${timestamp} [${label}] ${level} ${message}`
})

const Logger = winston.createLogger({
    level: LoggerLevel.INFO,
    format: combine(
        winston.format.errors({ stack: true }),
        winston.format.colorize(),
        label({ label: 'janitor' }),
        timestamp(),
        myFormat
    ),
    silent: false,
    transports: [
        new winston.transports.Console()
    ],
})

export default Logger
