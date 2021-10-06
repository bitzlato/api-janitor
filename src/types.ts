export type PlatformType = 'android' | 'ios'
export interface IVersion {
    version: string;
    message: Message;
    blockApp: boolean;
}

export interface IError {
    status: number;
    message: string;
}

export enum Message {
    UP_TO_DATE = 'upToDate',
    NEED_UPDATE_FORCE = 'needUpdateForce',
    NEED_UPDATE = 'needUpdate'
}

export interface IRequestParams {
    platform: PlatformType;
    osVersion: string;
    appVersion: string;
}

export interface IResponse {
    appLink: string;
    message: Message;
    blockApp: boolean;
    urls: string[]
}

export interface IConfig {
    hosts: string[],
    versions: IVersion[],
    app_links: { android: string, ios: string }
}

export interface IArgs {
    debug: boolean
    port: number
}
