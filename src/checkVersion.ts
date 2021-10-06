import semver from "semver";
import { Message } from "./types";
import getConfig from "./getConfig";

export function checkVersion(appVersion: string): { message: Message, blockApp: boolean } {
    const config = getConfig()
    const versions = config.versions

    return versions.find((v) => semver.satisfies(appVersion, v.version))
        || { message: Message.NEED_UPDATE_FORCE, blockApp: true }
}
