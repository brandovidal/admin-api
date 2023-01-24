import { describe, expect, it } from "vitest";

import { Prisma } from "@prisma/client"

import { HttpCode } from "../src/types/http-code"

import { server } from "./server";

describe.concurrent('API methods', () => {
    describe('User methods', () => {

        describe('GET /users', () => {
            it('should respond with a 200 status code', async () => {
                const response = await server.get('/users').send()

                expect(response.status).toBe(HttpCode.OK)
            })

            it('should respond with an array of users', async () => {
                const response = await server.get('/users').send()
                const data = response.body?.data

                expect(response.status).toBe(HttpCode.OK)
                expect(data).toBeInstanceOf(Array)
            })

            it('should respond with a user with name is contain jon', async () => {
                const response = await server.get('/users?name=jon').send()
                const data = response.body?.data

                expect(response.status).toBe(HttpCode.OK)
                expect(data).toBeInstanceOf(Object)
            })
        })

        describe('POST /users', () => {
            it('should respond with a 201 status code', async () => {
                const userInput = {
                    email: 'jon.snow@got.com',
                    name: 'Jon Snow',
                    dateOfBirth: "2023-01-20T16:49:52.500+00:00",
                    location: {
                        address: "2 Rue de l'opera",
                        city: 'Paris',
                        country: 'FRA'
                    }
                }
                const response = await server.post('/users').send(userInput)
                
                expect(response.status).toBe(HttpCode.CREATED)
                expect(response.headers['Content-Type']).contains(/json/)
            })

            it('should respond with a missing param', async () => {
                const userInputWithParamsMissing = {
                    email: 'jon.snow@got.com',
                }
                const response = await server.post('/users').send(userInputWithParamsMissing)

                expect(response.status).toBe(HttpCode.BAD_REQUEST)
                expect(response.headers['Content-Type']).contains(/json/)
            })

            it('should respond with a user exist message', async () => {
                const userInputExistInDB = {
                    email: 'jon.snow@got.com',
                    name: 'Jon Snow',
                    dateOfBirth: "2023-01-20T16:49:52.500+00:00",
                    location: {
                        address: "2 Rue de l'opera",
                        city: 'Paris',
                        country: 'FRA'
                    }
                }
                const response = await server.post('/users').send(userInputExistInDB)

                expect(response.status).toBe(HttpCode.FORBIDDEN)
                expect(response.headers['Content-Type']).contains(/json/)
            })
        })

        describe('PUT /users', () => {
            it('should respond with a 200 status code', async () => {
                const users = await server.get('/users').send()
                const userFinded: Prisma.UserCreateInput = users?.body?.data?.[0]
                const { id, ...user } = userFinded

                expect(users.status).toBe(HttpCode.OK)
                expect(userFinded).toBeInstanceOf(Object)

                const updatedUserInput = {
                    ...user,
                    name: 'Roger Hudson',
                }
                
                const response = await server.put(`/users/${userFinded?.id}`).send(updatedUserInput)

                expect(response.status).toBe(HttpCode.OK)
                expect(response.headers['Content-Type']).contains(/json/)
            })
        })

        describe('DELETE /users', () => {
            it('should respond with a 200 status code', async () => {
                const users = await server.get('/users').send()
                const userFinded: Prisma.UserCreateInput = users?.body?.data?.[0]
                const { id, ...user } = userFinded

                expect(users.status).toBe(HttpCode.OK)
                expect(userFinded).toBeInstanceOf(Object)
                
                const response = await server.delete(`/users/${userFinded?.id}`).send()

                expect(response.status).toBe(HttpCode.OK)
            })
        })
    })

    describe('post methods', () => {
        let authorId = ''
        
        describe('GET /posts', () => {
            it('should respond with a 200 status code', async () => {
                const response = await server.get('/posts').send()
                expect(response.status).toBe(HttpCode.OK)
            })

            it('should respond with an array of posts', async () => {
                const response = await server.get('/posts').send()
                const data = response.body?.data

                expect(response.status).toBe(HttpCode.OK)
                expect(data).toBeInstanceOf(Array)
            })

            it('should respond with a user with name is contain jon', async () => {
                const response = await server.get('/posts?name=jon').send()
                const data = response.body?.data

                expect(response.status).toBe(HttpCode.OK)
                expect(data).toBeInstanceOf(Object)
            })
        })

        describe('POST /posts', () => {
            it('should respond with a 201 status code', async () => {
                const userInput = {
                    email: 'xime.centurion@got.com',
                    name: 'xime centurion',
                    dateOfBirth: "2023-01-20T16:49:52.500+00:00",
                    location: {
                        address: "2 Rue de l'opera",
                        city: 'Paris',
                        country: 'FRA'
                    }
                }
                const user = await server.post('/users').send(userInput)
                authorId = user.body.data?.id
                
                expect(user.status).toBe(HttpCode.CREATED)
                expect(user.headers['Content-Type']).contains(/json/)
                
                const postInput = {
                    authorId,
                    title: "Other post",
                    content: "other post from testing",
                    viewCount: 17,
                    isPublished: false
                }
                const response = await server.post('/posts').send(postInput)
                
                expect(response.status).toBe(HttpCode.CREATED)
                expect(response.headers['Content-Type']).contains(/json/)
            })

            it('should respond with a missing params', async () => {
                const postInputWithParamsMissing = {
                    title: "Second post",
                }
                const response = await server.post('/posts').send(postInputWithParamsMissing)

                expect(response.status).toBe(HttpCode.BAD_REQUEST)
                expect(response.headers['Content-Type']).contains(/json/)
            })

            it('should respond with a user exist message', async () => {
                const postInputExistInDB = {
                    authorId,
                    title: "Other post",
                    content: "other post from testing",
                    viewCount: 17,
                    isPublished: false
                }
                const response = await server.post('/posts').send(postInputExistInDB)

                expect(response.status).toBe(HttpCode.FORBIDDEN)
                expect(response.headers['Content-Type']).contains(/json/)
            })
        })

        describe('PUT /posts', () => {
            it('should respond with a 200 status code', async () => {
                const posts = await server.get('/posts').send()
                const postFinded: Prisma.UserCreateInput = posts?.body?.data?.[0]
                const { id, createdAt, updatedAt,  ...post } = postFinded

                expect(posts.status).toBe(HttpCode.OK)
                expect(postFinded).toBeInstanceOf(Object)

                const updatedUserInput = {
                    ...post,
                    title: 'post edited',
                }
                
                const response = await server.put(`/posts/${id}`).send(updatedUserInput)

                expect(response.status).toBe(HttpCode.OK)
                expect(response.headers['Content-Type']).contains(/json/)
            })
        })

        describe('DELETE /posts', () => {
            it('should only remove post', async () => {
                const posts = await server.get('/posts').send()
                const postFinded: Prisma.UserCreateInput = posts?.body?.data?.[0]
                const { id } = postFinded

                expect(posts.status).toBe(HttpCode.OK)
                expect(postFinded).toBeInstanceOf(Object)

                const response = await server.delete(`/posts/${id}`).send()
                expect(response.status).toBe(HttpCode.OK)

            })

            it('should remove user with post', async () => {
                const response = await server.delete(`/users/${authorId}`).send()
                expect(response.status).toBe(HttpCode.OK)
            })
        })
    })
})
