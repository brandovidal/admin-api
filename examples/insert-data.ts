import type { Prisma } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

import { logger } from '../src/utils/logger'

const prisma = new PrismaClient()

export const insertUserAndPost = async (): Promise<void> => {
  await prisma.user.deleteMany()
  await prisma.course.deleteMany()
  await prisma.program.deleteMany()

  const userInput: Prisma.UserUncheckedCreateInput = {
    email: 'ian.watson@got.com',
    name: 'Ian Watson',
    username: 'ianwatson',
    password: 'password'
  }
  
  await prisma.user.create({
    data: userInput
  })

  const courseInput: Prisma.CourseCreateInput ={
    name: 'Programacion',
    code: 'PROGRAMACION',
    uniqueProgram: false,
    status: false,
    program: {
      createMany: {
        data: [
          {
            name:  'Usando Prisma',
            code: 'USANDOPRISMA',
            status: true
          },
          {
            name:  'Implementando Prisma',
            code: 'IMPLEMENTANDOPRISMA',
            status: false
          }
        ]
      }
    }
  }

  await prisma.course.create({
    data: courseInput
  })
  logger.info('Course created')

  const courses = await prisma.course.findMany({
    include: {
      program: true
    }
  })
  logger.info(JSON.stringify(courses, null, 2))

  await prisma.course.deleteMany({})
  logger.info('All courses deleted')

  await prisma.$disconnect()
}

void insertUserAndPost().then()
