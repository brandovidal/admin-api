import type { Prisma, Enrollment } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

import { CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'

import type { EnrollmentsResponse } from '../../interfaces/enrollment'

import { PAGE_DEFAULT, SIZE_DEFAULT, TTL_DEFAULT } from '../../constants/repository'

import isEmpty from 'just-is-empty'

export const excludedFields = ['password', 'verified', 'verificationCode']

const enrollmentCache = new CacheContainer(new MemoryStorage())

const prisma = new PrismaClient()

export const getEnrollments = async (startDate?: string, endDate?: string, page = PAGE_DEFAULT, limit = SIZE_DEFAULT): Promise<EnrollmentsResponse> => {
  const take = limit ?? SIZE_DEFAULT
  const skip = (page - 1) * take

  const cachedEnrollments = await enrollmentCache.getItem<Enrollment[]>('get-enrollments') ?? []
  const cachedTotalEnrollments = await enrollmentCache.getItem<number>('total-enrollments') ?? 0

  // params
  const cachedName = await enrollmentCache.getItem<number>('get-startDate-enrollments')
  const cachedCode = await enrollmentCache.getItem<number>('get-endDate-enrollments')
  const cachedSize = await enrollmentCache.getItem<number>('get-limit-enrollments')
  const cachedPage = await enrollmentCache.getItem<number>('get-page-enrollments')

  if (!isEmpty(cachedEnrollments) && cachedName === startDate && cachedCode === endDate && cachedSize === limit && cachedPage === page) {
    return { count: cachedEnrollments.length, total: cachedTotalEnrollments, enrollments: cachedEnrollments }
  }

  const [total, enrollments] = await prisma.$transaction([
    prisma.enrollment.count(),
    prisma.enrollment.findMany({
      where: {
        startDate,
        endDate,
      },
      take,
      skip,
      orderBy: {
        updatedAt: 'asc'
      }
    })
  ])

  const count = enrollments.length

  await enrollmentCache.setItem('get-enrollments', enrollments, { ttl: TTL_DEFAULT })
  await enrollmentCache.setItem('total-enrollments', total, { ttl: TTL_DEFAULT })

  // params
  await enrollmentCache.setItem('get-startDate-enrollments', startDate, { ttl: TTL_DEFAULT })
  await enrollmentCache.setItem('get-endDate-enrollments', endDate, { ttl: TTL_DEFAULT })
  await enrollmentCache.setItem('get-limit-enrollments', limit, { ttl: TTL_DEFAULT })
  await enrollmentCache.setItem('get-page-enrollments', page, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return { count, total, enrollments }
}

export const getEnrollmentById = async (enrollmentId: string): Promise<Enrollment> => {
  const cachedEnrollmentById = await enrollmentCache.getItem<Enrollment>('get-enrollment-by-id') as Enrollment
  const cachedEnrollmentId = await enrollmentCache.getItem<string>('get-id-enrollment')

  if (!isEmpty(cachedEnrollmentById) && cachedEnrollmentId === enrollmentId) {
    return cachedEnrollmentById
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      id: enrollmentId
    }
  }) as Enrollment

  await enrollmentCache.setItem('get-enrollment-by-id', enrollment, { ttl: TTL_DEFAULT })

  // params
  await enrollmentCache.setItem('get-id-enrollment', enrollmentId, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return enrollment
}

export const getEnrollment = async (startDate?: string, endDate?: string): Promise<Enrollment> => {
  const cachedEnrollment = await enrollmentCache.getItem<Enrollment>('get-only-enrollment') as Enrollment

  // params
  const cachedName = await enrollmentCache.getItem<number>('get-only-startDate')
  const cachedCode = await enrollmentCache.getItem<number>('get-only-endDate')

  if (!isEmpty(cachedEnrollment) && cachedName === startDate && cachedCode === endDate) {
    return cachedEnrollment
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      startDate,
      endDate,
    }
  }) as Enrollment

  await enrollmentCache.setItem('get-only-enrollment', enrollment, { ttl: TTL_DEFAULT })

  // params
  await enrollmentCache.setItem('get-only-startDate', startDate, { ttl: TTL_DEFAULT })
  await enrollmentCache.setItem('get-only-endDate', endDate, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return enrollment
}

export const getUniqueEnrollment = async (where: Prisma.EnrollmentWhereUniqueInput, select?: Prisma.EnrollmentSelect): Promise<Enrollment> => {
  const enrollment = (await prisma.enrollment.findUnique({
    where,
    select
  })) as Enrollment

  void prisma.$disconnect()
  return enrollment
}

export const createEnrollment = async (enrollmentInput: Prisma.EnrollmentCreateInput): Promise<Enrollment> => {
  const enrollment = await prisma.enrollment.create({ data: enrollmentInput })
  void prisma.$disconnect()
  return enrollment
}

export const updateEnrollment = async (enrollmentId: string, enrollmentInput: Enrollment): Promise<Enrollment> => {
  const enrollment = await prisma.enrollment.update({
    where: {
      id: enrollmentId
    },
    data: enrollmentInput
  })
  void prisma.$disconnect()
  return enrollment
}

export const deleteEnrollment = async (enrollmentId: string): Promise<number> => {
  const enrollment = await prisma.enrollment.deleteMany({
    where: {
      id: {
        in: [enrollmentId]
      }
    },
  })
  void prisma.$disconnect()
  return enrollment.count
}
