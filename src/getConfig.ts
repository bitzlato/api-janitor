import yaml from 'js-yaml'
import fs from 'fs'
import { IConfig } from "./types";

function getConfig(): IConfig {
    try {
        if (process.env.NODE_ENV === 'UNIT_TEST') {
            return yaml.load(fs.readFileSync(__dirname.concat('/../test/settings.tests.yml'), 'utf-8')) as IConfig
        } else {
            return yaml.load(fs.readFileSync(__dirname.concat('/../config/settings.yml'), 'utf-8')) as IConfig
        }
    } catch (e) {
        throw new Error(`Error during reading yaml: ${e}`)
    }

}

export default getConfig
