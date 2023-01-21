import { describe, expect, test } from "vitest";
import request from 'supertest'

import { app } from "../src/index";

describe('GET /user', () => {
    test('should respond with a 200 sattus code', async () => {
        const response = await request(app).get('/user').send()
        expect(response.status).toBe(200)
    })

    test('should respond with an array of users', async () => {
        const response = await request(app).get('/user').send()
        const data = response.body?.body?.data
        expect(data).toBeInstanceOf(Array)
    })
})
