import { describe, expect, it } from 'vitest'
import request from 'supertest'

import type { Course, Prisma, Program, Student } from '@prisma/client'

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
          username: 'dracon',
          email: 'dracon@gmail.com'
        }
        const response = await server
          .post('/api/auth/register')
          .send(userInputWithParamsMissing)

        expect(response.status).toBe(HttpCode.BAD_REQUEST)
        expect(response.headers['Content-Type']).contains(/json/)
      })

      // it('should respond with a user exist message', async () => {
      //   const userInputExistInDB = {
      //     username: "dracon",
      //     name: "Dracon",
      //     email: "dracon@gmail.com",
      //     password: "admin123",
      //     passwordConfirm: "admin123"
      //   }
      //   const response = await server.post('/api/auth/register').send(userInputExistInDB)

      //   expect(response.status).toBe(HttpCode.CONFLICT)
      //   expect(response.headers['Content-Type']).contains(/json/)
      // })
    })

    describe('POST /api/auth/login', () => {
      it('should respond with login', async () => {
        const loginInput = {
          email: 'dracon@gmail.com',
          password: 'admin123'
        }

        const response = await server.post('/api/auth/login').send(loginInput)

        expect(response.status).toBe(HttpCode.OK)
        expect(response.headers['Content-Type']).contains(/json/)
      })

      it('should respond with a missing input', async () => {
        const userInputWithParamsMissing = {
          email: 'dracon@gmail.com'
        }
        const response = await server
          .post('/api/auth/login')
          .send(userInputWithParamsMissing)

        expect(response.status).toBe(HttpCode.BAD_REQUEST)
        expect(response.headers['Content-Type']).contains(/json/)
      })

      it('should respond with email or password incorrect', async () => {
        const userInputExistInDB = {
          email: 'dracon@gmail.com',
          password: 'admin1234'
        }
        const response = await server
          .post('/api/auth/login')
          .send(userInputExistInDB)

        expect(response.status).toBe(HttpCode.BAD_REQUEST)
        expect(response.headers['Content-Type']).contains(/json/)
      })
    })
  })

  describe('Course methods', () => {
    describe('POST /api/courses', () => {
      it('should respond with a 201 status code', async () => {
        const courseInput: Prisma.CourseCreateInput = {
          name: 'React',
          code: 'REACT',
          uniqueProgram: true
        }

        const response = await server.post('/api/courses').send(courseInput)

        expect(response.status).toBe(HttpCode.CREATED)
        expect(response.headers['Content-Type']).contains(/json/)
      })
    })
  })

  describe('Program methods', () => {
    describe('POST /api/programs', () => {
      it('should respond with a 201 status code', async () => {
        const courses = await server.get('/api/courses').send()
        const courseFinded = courses?.body?.data?.[0]
        const courseId = courseFinded?.id as string

        const programInput = {
          name: 'Fullstack',
          code: 'FS',
          courseId
        }

        const response = await server.post('/api/programs').send(programInput)

        expect(response.status).toBe(HttpCode.CREATED)
        expect(response.headers['Content-Type']).contains(/json/)
      })
    })
  })

  describe('Student methods', () => {
    describe('POST /api/students', () => {
      it('should respond with a 201 status code', async () => {
        const studentInput: Prisma.StudentCreateInput = {
          name: 'Ofelio',
          lastname: 'diaz',
          email: 'ofelio@correo.com',
          birthday: new Date(),
          dni: 12345678,
          status: false
        }

        const response = await server.post('/api/students').send(studentInput)
        console.log("🚀 ~ file: index.test.ts:147 ~ it ~ response:", response)

        expect(response.status).toBe(HttpCode.CREATED)
        expect(response.headers['Content-Type']).contains(/json/)
      })
    })
  })

  describe('Enrollment methods', () => {
    describe('POST /api/enrollments', () => {
      it('should respond with a 201 status code', async () => {
        const students = await server.get('/api/students').send()
        const studentFinded: Student = students?.body?.data?.[0]
        const studentId = studentFinded?.id

        const programs = await server.get('/api/programs').send()
        const programFinded: Program = programs?.body?.data?.[0]
        const programId = programFinded?.id

        const enrollmentInput = {
          studentId,
          programId,
          startDate: new Date(),
          endDate: new Date()
        }

        const response = await server
          .post('/api/enrollments')
          .send(enrollmentInput)

        expect(response.status).toBe(HttpCode.CREATED)
        expect(response.headers['Content-Type']).contains(/json/)
      })
    })
  })

  describe('Delete all data', () => {
    describe('DELETE /api/students', () => {
      it('should respond with a 200 status code', async () => {
        const students = await server.get('/api/students').send()
        const studentFinded: Student = students?.body?.data?.[0]
        const studentId = studentFinded?.id

        expect(students.status).toBe(HttpCode.OK)
        expect(studentFinded).toBeInstanceOf(Object)

        const response = await server
          .delete(`/api/students/${studentId}`)
          .send()
        expect(response.status).toBe(HttpCode.OK)
      })
    })

    describe('DELETE /api/courses', () => {
      it('should respond with a 200 status code', async () => {
        const courses = await server.get('/api/courses').send()
        const courseFinded: Course = courses?.body?.data?.[0]
        const courseId = courseFinded?.id

        expect(courses.status).toBe(HttpCode.OK)
        expect(courseFinded).toBeInstanceOf(Object)

        const response = await server.delete(`/api/courses/${courseId}`).send()
        expect(response.status).toBe(HttpCode.OK)
      })
    })

    describe('DELETE /api/users', () => {
      it('should respond with a 200 status code', async () => {
        const users = await server.get('/api/users').send()
        const userFinded: Prisma.UserCreateInput = users?.body?.data?.[0]
        const userId = userFinded?.id as string

        expect(users.status).toBe(HttpCode.OK)
        expect(userFinded).toBeInstanceOf(Object)

        const response = await server.delete(`/api/users/${userId}`).send()
        expect(response.status).toBe(HttpCode.OK)
      })
    })
  })
})
