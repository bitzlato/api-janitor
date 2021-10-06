import { server as serverApp } from '../src'
import http from "http";
import request from 'supertest'
import { IResponse } from "../src/types";
import { checkVersion } from "../src/checkVersion";
import getConfig from "../src/getConfig";

let server: http.Server | null = serverApp
const config = getConfig()

const upToDateMessage = 'Обновлений нет'
const needUpdateMessage = 'Вам желательно обновиться'
const needUpdateForceMessage = 'Данная версия приложения больше не поддерживается. Вам необходимо обновить приложение'

describe('Test /janitor path', () => {
    let expectedResponse: IResponse | null

    beforeEach(() => {
        expectedResponse = null
        server = serverApp
    })

    afterEach(() => {
        if (!!server) {
            server.close()
        }

        expectedResponse = null
        server = null
    })

    test('test with all valid params android', done => {
        request(server)
            .get("/janitor?platform=android&osVersion=14&appVersion=1.0.0")
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .then(response => {
                const appVersion = '1.0.0'

                const { message, blockApp } = checkVersion(appVersion)

                expectedResponse = {
                    appLink: config.app_links.android,
                        message,
                        blockApp,
                        urls: config.hosts
                }

                expect(response.statusCode).toBe(200);
                expect(response.body).toStrictEqual(expectedResponse)
                expect(expectedResponse.message).toStrictEqual(upToDateMessage)
                expect(expectedResponse.blockApp).toBe(false)

                done();
            });
    })

    test('test with all valid params ios', done => {
        request(server)
            .get("/janitor?platform=ios&osVersion=14&appVersion=1.0.0")
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .then(response => {
                const appVersion = '1.0.0'

                const { message, blockApp } = checkVersion(appVersion)

                expectedResponse = {
                    appLink: config.app_links.ios,
                    message,
                    blockApp,
                    urls: config.hosts
                }

                expect(response.statusCode).toBe(200);
                expect(response.body).toStrictEqual(expectedResponse)
                expect(expectedResponse.message).toStrictEqual(upToDateMessage)
                expect(expectedResponse.blockApp).toBe(false)

                done();
            });
    })

    test('test with appVersion = 0.9.8', done => {
        request(server)
            .get("/janitor?platform=ios&osVersion=14&appVersion=0.9.8")
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .then(response => {
                const appVersion = '0.9.8'

                const { message, blockApp } = checkVersion(appVersion)

                expectedResponse = {
                    appLink: config.app_links.ios,
                    message,
                    blockApp,
                    urls: config.hosts
                }

                expect(response.statusCode).toBe(200);
                expect(response.body).toStrictEqual(expectedResponse)
                expect(expectedResponse.message).toStrictEqual(needUpdateMessage)
                expect(expectedResponse.blockApp).toBe(false)

                done();
            });
    })

    test('test with appVersion = 0.8.9', done => {
        request(server)
            .get("/janitor?platform=ios&osVersion=14&appVersion=0.8.9")
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .then(response => {
                const appVersion = '0.8.9'

                const { message, blockApp } = checkVersion(appVersion)

                expectedResponse = {
                    appLink: config.app_links.ios,
                    message,
                    blockApp,
                    urls: config.hosts
                }

                expect(response.statusCode).toBe(200);
                expect(response.body).toStrictEqual(expectedResponse)
                expect(expectedResponse.message).toStrictEqual(needUpdateForceMessage)
                expect(expectedResponse.blockApp).toBe(true)

                done();
            });
    })



    test('test with wrong params platform = symbian', done => {
        request(server)
            .get("/janitor?platform=symbian&osVersion=14&appVersion=1.0.0")
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.statusCode).toBe(400);
                expect(response.body).toStrictEqual({ message: "Available platforms: [android, ios]. You specified: symbian", status: 400 })
                done();
            });
    })

    test('with without content-type = application/json header', done => {
        request(server)
            .get("/janitor?platform=symbian&osVersion=14&appVersion=1.0.0")
            .then(response => {
                expect(response.statusCode).toBe(415);
                done();
            });
    })

    test('with without accept = application/json header', done => {
        request(server)
            .get("/janitor?platform=symbian&osVersion=14&appVersion=1.0.0")
            .set('Content-Type', 'application/json')
            .then(response => {
                expect(response.statusCode).toBe(406);
                done();
            });
    })
})
