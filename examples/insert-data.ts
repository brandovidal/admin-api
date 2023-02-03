import type { Prisma } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

import { logger } from '../src/utils/logger'

const prisma = new PrismaClient()

export const insertUserAndPost = async (): Promise<void> => {
  await prisma.user.deleteMany()
  await prisma.enrollment.deleteMany()

  await prisma.course.deleteMany()
  await prisma.program.deleteMany()

  await prisma.student.deleteMany()

  const userInput: Prisma.UserUncheckedCreateInput = {
    email: 'ian.watson@got.com',
    name: 'Ian Watson',
    username: 'ianwatson',
    password: 'password'
  }
  
  await prisma.user.create({
    data: userInput
  })
  logger.info('User created')

  const courseInput: Prisma.CourseCreateInput ={
    name: 'Programacion',
    code: 'PROGRAMACION',
    uniqueProgram: false,
    status: false
  }

  const course = await prisma.course.create({
    data: courseInput
  })
  logger.info('Course created')
  // logger.info(JSON.stringify(course, null, 2))

  const programInput: Prisma.ProgramCreateManyInput[] = [
    {
      name:  'Usando Prisma',
      code: 'USANDOPRISMA',
      status: true,
      courseId: course.id
    },
    {
      name:  'Implementando Prisma',
      code: 'IMPLEMENTANDOPRISMA',
      status: false,
      courseId: course.id
    }
  ]

  await prisma.program.createMany({
    data: programInput
  })
  logger.info('Programs created')

  const program = await prisma.program.findFirst({
    select: {
      id: true,
      code: true,
      name: true,
      amount: true,
      status: true,
      course: {
        select: {
          name: true,
          code: true,
          uniqueProgram: true
        }
      }
    }
  })
  logger.info(JSON.stringify(program, null, 2))

  // const studentInput: Prisma.StudentCreateInput = {
  //   name: 'Juan',
  //   lastname: 'Perez',
  //   email: 'juan@email.com',
  //   phone: 123456789,
  //   phoneWithFormat: '+51 123456789',
  //   country: 'PEN',
  //   dni: 87654321,
  //   birthday: new Date(),
  // }
  // const student = await prisma.student.create({
  //   data: studentInput
  // })
  // logger.info(JSON.stringify(student, null, 2))
  // logger.info('Student created')

  // const enrollemntInput: Prisma.EnrollmentCreateInput = {
  //   faceToFaceModality: true,
  //   marketingAds: ['recomendation', 'email'],
  //   marketingEmail: 'juan@email.com',
  //   marketingMedia: 'Correo electronico',
  //   enableMarketingAds: true,
  //   student: {
  //     connect: {
  //       id: student.id
  //     }
  //   },
  //   program: {
  //     connect: {
  //       id: program?.id
  //     }
  //   }
  // }
  // const enrollment = await prisma.enrollment.create({
  //   data: enrollemntInput
  // })
  // logger.info(JSON.stringify(enrollment, null, 2))
  // logger.info('Enrollment created')

  // await prisma.student.delete({
  //   where: {
  //     id: student.id
  //   }
  // })
  // logger.info('Student created')

  await prisma.$disconnect()
}

void insertUserAndPost().then()
