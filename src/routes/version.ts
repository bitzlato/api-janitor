import { Express } from "express";

const currentJanitorVersion = require('../../package.json').version

function version(app: Express) {
    app.get('/version', (req, res) => {
        const payload = { version: currentJanitorVersion }
        res.json(payload)
    })
}

export default version
