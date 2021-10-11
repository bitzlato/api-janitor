import semver from "semver";
import { IConfig } from "./types";

export function checkVersion(appVersion: string, config: IConfig): { message: string, blockApp: boolean } {
    const versions = config.versions

    return versions.find((v) => semver.satisfies(appVersion, v.version))!
}
