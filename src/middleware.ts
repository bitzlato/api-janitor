import type { NextFunction, Request, Response } from 'express'
import debug from "debug";
import { HttpException } from "./error";
import http from "http";

const janitorError = debug('janitor:error')

export function jsonApiMiddleware(req: Request, res: Response, next: NextFunction) {
    const headerContentType = req.header('content-type')
    const headerAccept = req.header('accept')

    if (!headerContentType || !headerContentType?.includes('application/json')) {
        return res.status(415).json(http.STATUS_CODES[415])
    }

    if (!headerAccept || !headerAccept?.includes('application/json')) {
        return res.status(406).json(http.STATUS_CODES[406])
    }

    next()
}

export function errorHandlerMiddleware(err: unknown, req: Request, res: Response, next: NextFunction) {
    if (err instanceof HttpException) {
        return res.status(err.status).json(err)
    }

    janitorError(err)

    next()
}

