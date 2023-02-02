import { describe, expect, it } from 'vitest'
import request from 'supertest'

import { Prisma } from '@prisma/client'

import { HttpCode } from '../src/types/response'
import { app } from '../src/index'

export const server = request(app)

describe.concurrent('API methods', () => {
  describe('Auth methods', () => {
    describe('POST /api/auth/register', () => {
      it('should respond with a 201 status code', async () => {
        const userInput = {
          username: 'dracon',
          name: 'Dracon',
          email: 'dracon@gmail.com',
          password: 'admin123',
          passwordConfirm: 'admin123'
        }

        const response = await server.post('/api/auth/register').send(userInput)

        expect(response.status).toBe(HttpCode.CREATED)
        expect(response.headers['Content-Type']).contains(/json/)
      })

      it('should respond with a missing param', async () => {
        const userInputWithParamsMissing = {
          username: "dracon",
          email: "dracon@gmail.com",
        }
        const response = await server.post('/api/auth/register').send(userInputWithParamsMissing)

        expect(response.status).toBe(HttpCode.BAD_REQUEST)
        expect(response.headers['Content-Type']).contains(/json/)
      })

      it('should respond with a user exist message', async () => {
        const userInputExistInDB = {
          username: "dracon",
          name: "Dracon",
          email: "dracon@gmail.com",
          password: "admin123",
          passwordConfirm: "admin123"
        }
        const response = await server.post('/api/auth/register').send(userInputExistInDB)

        expect(response.status).toBe(HttpCode.CONFLICT)
        expect(response.headers['Content-Type']).contains(/json/)
      })
    })

    describe('POST /api/auth/login', () => {
      it('should respond with login', async () => {
        const loginInput = {
          email: 'dracon@gmail.com',
          password: 'admin123',
        }

        const response = await server.post('/api/auth/login').send(loginInput)

        expect(response.status).toBe(HttpCode.OK)
        expect(response.headers['Content-Type']).contains(/json/)
      })

      it('should respond with a missing input', async () => {
        const userInputWithParamsMissing = {
          email: "dracon@gmail.com",
        }
        const response = await server.post('/api/auth/login').send(userInputWithParamsMissing)

        expect(response.status).toBe(HttpCode.BAD_REQUEST)
        expect(response.headers['Content-Type']).contains(/json/)
      })

      it('should respond with email or password incorrect', async () => {
        const userInputExistInDB = {
          email: "dracon@gmail.com",
          password: "admin1234",
        }
        const response = await server.post('/api/auth/login').send(userInputExistInDB)

        expect(response.status).toBe(HttpCode.BAD_REQUEST)
        expect(response.headers['Content-Type']).contains(/json/)
      })
    })
  })

  describe('User methods', () => {
    describe('GET /api/users', () => {
      it('should respond with an array of users', async () => {
        const response = await server.get('/api/users').send()
        const data = response.body?.data?.users

        expect(response.status).toBe(HttpCode.OK)
        expect(data).toBeInstanceOf(Array)
      })

      it('should respond with a user with name is contain jon', async () => {
        const response = await server.get('/api/users?name=jon').send()
        const data = response.body?.data

        expect(response.status).toBe(HttpCode.OK)
        expect(data).toBeInstanceOf(Object)
      })
    })

    describe('PUT /api/users', () => {
      it('should respond with a 200 status code', async () => {
        const users = await server.get('/api/users').send()
        const userFinded: Prisma.UserCreateInput = users?.body?.data?.users?.[0]
        const userId = userFinded?.id as string

        expect(users.status).toBe(HttpCode.OK)
        expect(userFinded).toBeInstanceOf(Object)

        const updatedUserInput = {
          name: 'Roger Hudson'
        }

        const response = await server.put(`/api/users/${userId}`).send(updatedUserInput)

        expect(response.status).toBe(HttpCode.OK)
        expect(response.headers['Content-Type']).contains(/json/)
      })
    })

    describe('DELETE /api/users', () => {
      it('should respond with a 200 status code', async () => {
        const users = await server.get('/api/users').send()
        const userFinded: Prisma.UserCreateInput = users?.body?.data?.users?.[0]
        const userId = userFinded?.id as string

        expect(users.status).toBe(HttpCode.OK)
        expect(userFinded).toBeInstanceOf(Object)

        const response = await server.delete(`/api/users/${userId}`).send()
        expect(response.status).toBe(HttpCode.OK)
      })
    })
  })
})
