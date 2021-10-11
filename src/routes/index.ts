import { Express } from "express";

import janitor from './janitor'
import version from './version'

export default function routes(app: Express) {
    janitor(app)
    version(app)
}
