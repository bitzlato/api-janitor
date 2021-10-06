import semver from "semver";
import getConfig from "./getConfig";

export function checkVersion(appVersion: string): { message: string, blockApp: boolean } {
    const config = getConfig()
    const versions = config.versions

    return versions.find((v) => semver.satisfies(appVersion, v.version))!
}
