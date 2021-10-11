import express from 'express'
import http from 'http'
import terminus from '@godaddy/terminus'
import janitor from "./app";
import { Command } from 'commander';
import { IArgs } from "./types";
import { errorHandlerMiddleware, jsonApiMiddleware, loggerMiddleware } from "./middleware";
import Logger from "./logger";

const program = new Command();

program
    .option('--level [level]', `Logger level <string>. One of following options: [ error, info, debug ];`, 'info')
    .option('--silent', 'Disable logs <boolean>', false)
    .option('--port [port]', 'Port <number>', '8080')
    .parse()

const opts = program.opts<IArgs>()
const port = opts.port

// Logger
const level = opts.level
const silent = opts.silent
Logger.level = level
Logger.silent = silent
Logger.info('Run Janitor')

// Express app
const app = express()
app.disable('x-powered-by')
app.disable('etag')

app.use(jsonApiMiddleware)
app.use(loggerMiddleware)

// Janitor app
janitor(app)

// error handler
app.use(errorHandlerMiddleware)

export const server = http.createServer(app)

async function onSignal () {
    // start cleanup of resource, like databases or file descriptors
    Logger.info('Stop Janitor')
    Logger.end()

    server.close()
}

async function onHealthCheck () {
    // checks if the system is healthy, like the db connection is live
    // resolves, if health, rejects if not
}

terminus.createTerminus(server, {
    signal: 'SIGINT',
    healthChecks: { '/healthcheck': onHealthCheck },
    onSignal
})

server.listen(port)
