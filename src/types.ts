export type PlatformType = 'android' | 'ios'

export interface IRequestParams {
    platform: PlatformType;
    osVersion: string;
    appVersion: string;
}

export interface IResponse {
    appLink: string;
    shouldUpdate: boolean;
    shouldBlockApp: boolean;
    urls: string[]
}

export interface IConfig {
    api_hosts: { production: string[] },
    versions: { stable: { major: number, minor: number, patch: number | string } },
    app_links: { android: string, ios: string }
}

export interface IArgs {
    debug: boolean
    port: number
}
