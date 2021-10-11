import { server as serverApp } from "../src";
import http from "http";
import request from "supertest";

const currentJanitorVersion = require('../package.json').version

describe('Test /version endpoint', () => {
    const server: http.Server = serverApp

    afterAll(() => {
        server.close()
    })

    test('GET /version', done => {
        request(server)
            .get("/version")
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.statusCode).toBe(200)
                expect(response.body).toStrictEqual({ version: currentJanitorVersion })

                done()
            })
    })
})
