import express from 'express'
import http from 'http'
import terminus from '@godaddy/terminus'
import routes from "./routes";
import { Command } from 'commander';
import { IArgs } from "./types";
import { errorHandlerMiddleware, jsonApiMiddleware, loggerMiddleware } from "./middleware";
import Logger from "./logger";
import bugsnag from '@bugsnag/js'
import bugsnagPluginExpress from "@bugsnag/plugin-express";
import getConfig from "./getConfig";

const program = new Command();

program
    .option('--level [level]', `Logger level <string>. One of following options: [ error, info, debug ];`, 'info')
    .option('--silent', 'Disable logs <boolean>', false)
    .option('--port [port]', 'Port <number>', '8080')
    .allowUnknownOption()
    .parse()

if (process.env.NODE_ENV !== 'development') {
    const config = getConfig()

    bugsnag.start({
        apiKey: config.bugsnag.app_key,
        plugins: [bugsnagPluginExpress],
        appVersion: require('../package.json').version
    })
}

const opts = program.opts<IArgs>()
const port = opts.port

// Logger
const level = opts.level
const silent = opts.silent
Logger.level = level
Logger.silent = silent

Logger.info(`Run Janitor. Version: ${require('../package.json').version}`)

// Express app
const app = express()
app.disable('x-powered-by')
app.disable('etag')

if (process.env.NODE_ENV !== 'development') {
    const bugsnagMiddleware = bugsnag.getPlugin('express')!

// bugsnag middleware
    app.use(bugsnagMiddleware.requestHandler)
    app.use(bugsnagMiddleware.errorHandler)
}

// app middleware
app.use(jsonApiMiddleware)
app.use(loggerMiddleware)

// Janitor app
routes(app)

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
