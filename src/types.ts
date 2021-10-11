export type PlatformType = 'android' | 'ios'
export interface IVersion {
    version: string;
    message: string;
    blockApp: boolean;
}

export interface IRequestParams {
    platform: PlatformType;
    osVersion: string;
    appVersion: string;
}

export interface IResponse {
    appLink: string;
    message: string;
    blockApp: boolean;
    urls: string[]
}

export interface IConfig {
    hosts: string[],
    versions: IVersion[],
    app_links: { android: string, ios: string }
}

export enum LoggerLevel {
    ERROR = 'error',
    INFO = 'info',
    DEBUG = 'debug',
}

export interface IArgs {
    level: LoggerLevel
    port: number
}
