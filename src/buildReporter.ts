import getConfig from "./getConfig";

const reportBuild = require('bugsnag-build-reporter')
const janitorVersion =  require('../package.json').version

const BUGSNAG_API_KEY = getConfig().bugsnag.app_key

const report = { apiKey: BUGSNAG_API_KEY, appVersion: janitorVersion, releaseStage: process.env.NODE_ENV }

reportBuild(report)
    .then(() => console.log('Build report sent to Bugsnag!'))
    .catch((err: { message: string }) => console.log('Fail to send build report to Bugsnag', err.message))
