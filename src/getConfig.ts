import yaml from 'js-yaml'
import fs from 'fs'
import { IConfig } from "./types";

function getConfig(): IConfig {
    try {
        return yaml.load(fs.readFileSync(__dirname.concat('/../conf.yaml'), 'utf-8')) as IConfig
    } catch (e) {
        throw new Error(`Error during reading yaml: ${e}`)
    }

}

export default getConfig
