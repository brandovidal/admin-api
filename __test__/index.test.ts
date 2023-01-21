import { describe, expect, test } from "vitest";
import request from 'supertest'

import { app } from "../src/index";
import { HttpCode } from "../src/utils/message";

describe('GET /user', () => {
    test('should respond with a 200 status code', async () => {
        const response = await request(app).get('/user').send()

        expect(response.status).toBe(HttpCode.OK)
    })

    test('should respond with an array of users', async () => {
        const response = await request(app).get('/user').send()
        const data = response.body?.data

        expect(response.status).toBe(HttpCode.OK)
        expect(data).toBeInstanceOf(Array)
    })
}).clear()

// describe('POST /user', () => {
//     test('should respond with a 201 status code', async () => {
//         const userInput = {
//             email: 'jon.snow@got.com',
//             name: 'Jon Snow',
//             dateOfBirth: new Date(1995, 1, 23),
//             location: {
//             address: "2 Rue de l'opera",
//             city: 'Paris',
//             country: 'FRA'
//             }
//         }
//         const response = await request(app).post('/user').send(userInput)
        
//         expect(response.status).toBe(HttpCode.OK)
//         expect(response.headers['Content-Type']).contains(/json/)
//     })

//     test('should respond with a missing param', async () => {
//         const userInputWithParamsMissing = {
//             email: 'jon.snow@got.com',
//             name: 'Jon Snow',
//         }
//         const response = await request(app).post('/user').send(userInputWithParamsMissing)

//         expect(response.status).toBe(HttpCode.BAD_REQUEST)
//         expect(response.headers['Content-Type']).contains(/json/)
//     })

//     test('should respond with a user exist message', async () => {
//         const userInputExistInDB = {
//             email: 'jon.snow@got.com',
//             name: 'Jon Snow',
//             dateOfBirth: new Date(1995, 1, 23),
//             location: {
//             address: "2 Rue de l'opera",
//             city: 'Paris',
//             country: 'FRA'
//             }
//         }
//         const response = await request(app).post('/user').send(userInputExistInDB)
//         console.log("🚀 ~ file: index.test.ts:43 ~ test ~ response", response.status)

//         expect(response.status).toBe(HttpCode.FORBIDDEN)
//         expect(response.headers['Content-Type']).contains(/json/)
//     })
// })

describe('PUT /user', () => {
    test('should respond with a 201 status code', async () => {
        const users = await request(app).get('/user').send()
        const data = users?.body?.data
        console.log("🚀 ~ file: index.test.ts:75 ~ test ~ data", data)

        expect(users.status).toBe(HttpCode.OK)

        // const userInput = {
        //     email: 'jon.snow@got.com',
        //     name: 'Jon Snow',
        //     dateOfBirth: new Date(1995, 1, 23),
        //     location: {
        //     address: "2 Rue de l'opera",
        //     city: 'Paris',
        //     country: 'FRA'
        //     }
        // }
        // const response = await request(app).post('/user').send(userInput)
        
        // expect(response.status).toBe(HttpCode.OK)
        // expect(response.headers['Content-Type']).contains(/json/)
    })

    // test('should respond with a missing param', async () => {
    //     const userInputWithParamsMissing = {
    //         email: 'jon.snow@got.com',
    //         name: 'Jon Snow',
    //     }
    //     const response = await request(app).post('/user').send(userInputWithParamsMissing)

    //     expect(response.status).toBe(HttpCode.BAD_REQUEST)
    //     expect(response.headers['Content-Type']).contains(/json/)
    // })

    // test('should respond with a user exist message', async () => {
    //     const userInputExistInDB = {
    //         email: 'jon.snow@got.com',
    //         name: 'Jon Snow',
    //         dateOfBirth: new Date(1995, 1, 23),
    //         location: {
    //         address: "2 Rue de l'opera",
    //         city: 'Paris',
    //         country: 'FRA'
    //         }
    //     }
    //     const response = await request(app).post('/user').send(userInputExistInDB)
    //     console.log("🚀 ~ file: index.test.ts:43 ~ test ~ response", response.status)

    //     expect(response.status).toBe(HttpCode.FORBIDDEN)
    //     expect(response.headers['Content-Type']).contains(/json/)
    // })
})