import { Express } from "express";
import { IRequestParams, IResponse } from "./types";
import getConfig from "./getConfig";
import { checkVersion } from "./checkVersion";
import debug from "debug";

const janitorDebug = debug('janitor:debug')

function janitor(app: Express) {
    app.get(
        '/janitor',
        (req, res, next) => {
            const config = getConfig()

            const requestParams = req.query as unknown as IRequestParams

            const platform = requestParams.platform
            const osVersion = requestParams.osVersion
            const appVersion = requestParams.appVersion

            if (!platform || !osVersion || !appVersion) {
                janitorDebug('Bad request for /janitor. '
                    .concat('platform:').concat(platform)
                    .concat('osVersion').concat(osVersion)
                    .concat('appVersion').concat(appVersion)
                )
                return res.status(400).send('Bad Request. You must specify platform, osVersion and appVersion!')
            }

            if (!['android', 'ios'].includes(platform)) {
                janitorDebug('Bad request for /janitor. '.concat('platform:').concat(platform))
                return res.status(400)
                    .send('Bad Request. Available platforms: [android, ios]. You specified: '.concat(platform))
            }

            const { shouldUpdate, shouldBlockApp } = checkVersion()

            const response: IResponse = {
                appLink: config.app_links[platform],
                shouldUpdate: shouldUpdate,
                shouldBlockApp: shouldBlockApp,
                urls: config.api_hosts.production
            }

            res.json(response)
    })
}

export default janitor
