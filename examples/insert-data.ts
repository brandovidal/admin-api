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

  const course = await prisma.course.create({
    data: courseInput
  })
  logger.info('Course created')
  // logger.info(JSON.stringify(course, null, 2))

  const program = await prisma.program.findFirst()
  logger.info('Program created')
  // logger.info(JSON.stringify(program, null, 2))

  // await prisma.program.delete({
  //   where: {
  //     id: program?.id
  //   }
  // })
  // logger.info('Program deleted')

  const studentInput: Prisma.StudentCreateInput = {
    name: 'Juan',
    lastname: 'Perez',
    email: 'juan@email.com',
    phone: 123456789,
    phoneWithFormat: '+51 123456789',
    country: 'PEN',
    dni: 87654321,
    birthday: new Date(),
  }

  const student = await prisma.student.create({
    data: studentInput
  })
  logger.info(JSON.stringify(student, null, 2))
  logger.info('Student created')

  await prisma.$disconnect()
}

void insertUserAndPost().then()
