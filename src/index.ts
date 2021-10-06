import express from 'express'
import http from 'http'
import terminus from '@godaddy/terminus'
import janitor from "./app";
import debug from 'debug'
import { Command } from 'commander';
import { IArgs } from "./types";
import { errorHandlerMiddleware, jsonApiMiddleware } from "./middleware";
const program = new Command();

program
    .option('--debug', 'Debug mode <boolean>', false)
    .option('--port [port]', 'Port <number>', '8080')
    .parse()

const opts = program.opts<IArgs>()
const isDebug = opts.debug
const port = opts.port

if (isDebug) {
    debug.enable('janitor:*')
}

const janitorDebug = debug('janitor:debug')
janitorDebug('Run API Janitor')

const app = express()
app.disable('x-powered-by')

app.use(jsonApiMiddleware)

janitor(app)

app.use(errorHandlerMiddleware)

export const server = http.createServer(app)

async function onSignal () {
    janitorDebug('Stop API Janitor')
    // start cleanup of resource, like databases or file descriptors

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
