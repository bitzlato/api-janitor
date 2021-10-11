import type { NextFunction, Request, Response } from 'express'
import { HttpException } from "./error";
import http from "http";
import Logger from "./logger";
import {IError} from "./types";

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
    Logger.debug(
        JSON.stringify({
            method: req.method,
            query: req.query,
            headers: req.headers,
            url: req.url
        }, null, 2)
    )

    next()
}

export function jsonApiMiddleware(req: Request, res: Response, next: NextFunction) {
    // const headerContentType = req.header('content-type')
    const headerAccept = req.header('accept')

    // if (!headerContentType || !headerContentType?.includes('application/json')) {
    //     return res.status(415).json(http.STATUS_CODES[415])
    // }

    if (!headerAccept || !headerAccept?.includes('application/json')) {
        return res.status(406).json(http.STATUS_CODES[406])
    }

    next()
}

export function errorHandlerMiddleware(err: unknown, req: Request, res: Response, next: NextFunction) {
    Logger.error(err)

    if (err instanceof HttpException) {
        const errorPayload: IError = { message: err.message, status: err.status }
        return res.status(err.status).json(errorPayload)
    }

    next()
}

