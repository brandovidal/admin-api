import { PrismaClient } from '@prisma/client'
import { logger } from '../src/utils/logger'

const prisma = new PrismaClient()

export const deleteData = async (): Promise<void> => {
  await prisma.user.deleteMany()
  await prisma.student.deleteMany()
  await prisma.enrollment.deleteMany()

  await prisma.country.deleteMany()
  await prisma.program.deleteMany()

  await prisma.course.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.membership.deleteMany()
  await prisma.certificate.deleteMany()

  logger.info('delete data')
}

void deleteData().then()
