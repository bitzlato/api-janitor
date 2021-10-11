import { IConfig } from "./types";
import { load } from "node-yaml-config";

function getConfig(): IConfig {
    try {
        if (process.env.NODE_ENV === 'UNIT_TEST') {
            return load(__dirname.concat('/../test/settings.tests.yml')) as IConfig
        } else {
            return load(__dirname.concat('/../config/settings.yml')) as IConfig
        }
    } catch (e) {
        throw new Error(`Error during reading yaml: ${e}`)
    }

}

export default getConfig
