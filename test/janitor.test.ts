import { server as serverApp } from '../src'
import http from "http";
import request from 'supertest'
import { IResponse } from "../src/types";
import { checkVersion } from "../src/checkVersion";
import getConfig from "../src/getConfig";

let server: http.Server | null = serverApp
const config = getConfig()
const { shouldUpdate, shouldBlockApp } = checkVersion()
const expectedResponse: IResponse = {
    appLink: config.app_links.android,
    shouldUpdate,
    shouldBlockApp,
    urls: config.api_hosts.production
}

describe('Test /janitor path', () => {
    beforeEach(() => {
        server = serverApp
    })

    afterEach(() => {
        if (!!server) {
            server.close()
        }

        server = null
    })

    test('test with all valid params android', done => {
        request(server)
            .get("/janitor?platform=android&osVersion=14&appVersion=1.2.3")
            .then(response => {
                expectedResponse.appLink = config.app_links.android
                expect(response.statusCode).toBe(200);
                expect(response.body).toStrictEqual(expectedResponse)

                done();
            });
    })

    test('test with all valid params ios', done => {
        request(server)
            .get("/janitor?platform=ios&osVersion=14&appVersion=1.2.3")
            .then(response => {
                expectedResponse.appLink = config.app_links.ios
                expect(response.statusCode).toBe(200);
                expect(response.body).toStrictEqual(expectedResponse)

                done();
            });
    })

    test('test with wrong params', done => {
        request(server)
            .get("/janitor?platform=symbian&osVersion=14&appVersion=1.2.3")
            .then(response => {
                expect(response.statusCode).toBe(400);
                done();
            });
    })
})
