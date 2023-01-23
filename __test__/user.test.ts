import { describe, expect, it } from "vitest";
import request from 'supertest'

import { Prisma } from "@prisma/client"

import { app } from "../src/index"
import { HttpCode } from "../src/types/http-code"

describe('GET /user', () => {
    it('should respond with a 200 status code', async () => {
        const response = await request(app).get('/user').send()

        expect(response.status).toBe(HttpCode.OK)
    })

    it('should respond with an array of users', async () => {
        const response = await request(app).get('/user').send()
        const data = response.body?.data

        expect(response.status).toBe(HttpCode.OK)
        expect(data).toBeInstanceOf(Array)
    })
}).clear()

describe('POST /user', () => {
    it('should respond with a 201 status code', async () => {
        const userInput = {
            email: 'jon.snow@got.com',
            name: 'Jon Snow',
            dateOfBirth: new Date(1995, 1, 23),
            location: {
            address: "2 Rue de l'opera",
            city: 'Paris',
            country: 'FRA'
            }
        }
        const response = await request(app).post('/user').send(userInput)
        
        expect(response.status).toBe(HttpCode.OK)
        expect(response.headers['Content-Type']).contains(/json/)
    })

    it('should respond with a missing param', async () => {
        const userInputWithParamsMissing = {
            email: 'jon.snow@got.com',
            name: 'Jon Snow',
        }
        const response = await request(app).post('/user').send(userInputWithParamsMissing)

        expect(response.status).toBe(HttpCode.BAD_REQUEST)
        expect(response.headers['Content-Type']).contains(/json/)
    })

    it('should respond with a user exist message', async () => {
        const userInputExistInDB = {
            email: 'jon.snow@got.com',
            name: 'Jon Snow',
            dateOfBirth: new Date(1995, 1, 23),
            location: {
            address: "2 Rue de l'opera",
            city: 'Paris',
            country: 'FRA'
            }
        }
        const response = await request(app).post('/user').send(userInputExistInDB)

        expect(response.status).toBe(HttpCode.FORBIDDEN)
        expect(response.headers['Content-Type']).contains(/json/)
    })
})

describe('PUT /user', () => {
    it('should respond with a 200 status code', async () => {
        const users = await request(app).get('/user').send()
        const userFinded: Prisma.UserCreateInput = users?.body?.data?.[0]
        const { id, ...user } = userFinded

        expect(users.status).toBe(HttpCode.OK)
        expect(userFinded).toBeInstanceOf(Object)

        const updatedUserInput = {
            ...user,
            name: 'Roger Hudson',
        }
        
        const response = await request(app).put(`/user/${userFinded?.id}`).send(updatedUserInput)

        expect(response.status).toBe(HttpCode.OK)
        expect(response.headers['Content-Type']).contains(/json/)
    })
})

describe('DELETE /user', () => {
    it('should respond with a 200 status code', async () => {
        const users = await request(app).get('/user').send()
        const userFinded: Prisma.UserCreateInput = users?.body?.data?.[0]
        const { id, ...user } = userFinded

        expect(users.status).toBe(HttpCode.OK)
        expect(userFinded).toBeInstanceOf(Object)

        const deletedUserInput = {
            ...user,
            name: 'Roger Hudson',
        }
        
        const response = await request(app).delete(`/user/${userFinded?.id}`).send(deletedUserInput)

        expect(response.status).toBe(HttpCode.OK)
    })
})