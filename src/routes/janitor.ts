import { Express } from "express";
import { IRequestParams, IResponse } from "../types";
import getConfig from "../getConfig";
import { checkVersion } from "../checkVersion";
import { HttpException } from "../error";
import Logger from "../logger";
const config = getConfig()

function janitor(app: Express) {
    app.get(
        '/janitor',
        (req, res, next) => {
            const requestParams = req.query as unknown as IRequestParams

            const platform = requestParams.platform
            const osVersion = requestParams.osVersion
            const appVersion = requestParams.appVersion

            if (!platform || !osVersion || !appVersion) {
                throw new HttpException(400, 'You must specify platform, osVersion and appVersion!')
            }

            if (!['android', 'ios'].includes(platform)) {
                throw new HttpException(400, 'Available platforms: [android, ios]. You specified: '.concat(platform) )
            }

            const { message, blockApp } = checkVersion(appVersion, config)

            const response: IResponse = {
                appLink: config.app_links[platform],
                message: message,
                blockApp: blockApp,
                urls: config.hosts
            }

            Logger.debug(`${req.url} --- ${JSON.stringify(response)}`)
            res.json(response)
        })
}

export default janitor
