import { server as serverApp } from '../src'
import http from "http";
import request from 'supertest'
import { IResponse } from "../src/types";
import { checkVersion } from "../src/checkVersion";
import getConfig from "../src/getConfig";

const upToDateMessage = 'Обновлений нет'
const needUpdateMessage = 'Вам желательно обновиться'
const needUpdateForceMessage = 'Данная версия приложения больше не поддерживается. Вам необходимо обновить приложение'

describe('Test /janitor endpoint', () => {
    const server: http.Server = serverApp

    let expectedResponse: IResponse | null
    const config = getConfig()

    beforeEach(() => {
        expectedResponse = null
    })

    afterEach(() => {
        expectedResponse = null
    })

    afterAll(() => {
        server.close()
    })

    test('test with all valid params android', done => {
        request(server)
            .get("/janitor?platform=android&osVersion=14&appVersion=1.0.0")

            .set('Accept', 'application/json')
            .then(response => {
                const appVersion = '1.0.0'

                const { message, blockApp } = checkVersion(appVersion, config)

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

            .set('Accept', 'application/json')
            .then(response => {
                const appVersion = '1.0.0'

                const { message, blockApp } = checkVersion(appVersion, config)

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

            .set('Accept', 'application/json')
            .then(response => {
                const appVersion = '0.9.8'

                const { message, blockApp } = checkVersion(appVersion, config)

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

            .set('Accept', 'application/json')
            .then(response => {
                const appVersion = '0.8.9'

                const { message, blockApp } = checkVersion(appVersion, config)

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

            .set('Accept', 'application/json')
            .then(response => {
                expect(response.statusCode).toBe(400);
                expect(response.body).toStrictEqual({ message: "Available platforms: [android, ios]. You specified: symbian", status: 400 })
                done();
            });
    })

    test('GET request without accept = application/json header', done => {
        request(server)
            .get("/janitor?platform=symbian&osVersion=14&appVersion=1.0.0")
            .then(response => {
                expect(response.statusCode).toBe(406);
                done();
            });
    })
})
