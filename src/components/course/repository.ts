import type { Prisma, Course } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

import { CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'

import type { CoursesResponse } from '../../interfaces/course'

import { PAGE_DEFAULT, SIZE_DEFAULT, TTL_DEFAULT } from '../../constants/repository'

import isEmpty from 'just-is-empty'
import { Response } from 'express'

export const excludedFields = ['password', 'verified', 'verificationCode']

const programCache = new CacheContainer(new MemoryStorage())

const prisma = new PrismaClient()

export const getCourses = async (name?: string, email?: string, page = PAGE_DEFAULT, size = SIZE_DEFAULT): Promise<CoursesResponse> => {
  const take = size ?? SIZE_DEFAULT
  const skip = (page - 1) * take

  const cachedCourses = await programCache.getItem<Course[]>('get-courses') ?? []
  const cachedTotalCourses = await programCache.getItem<number>('total-courses') ?? 0

  // params
  const cachedName = await programCache.getItem<number>('get-name-courses')
  const cachedEmail = await programCache.getItem<number>('get-email-courses')
  const cachedSize = await programCache.getItem<number>('get-size-courses')
  const cachedPage = await programCache.getItem<number>('get-page-courses')

  if (!isEmpty(cachedCourses) && cachedName === name && cachedEmail === email && cachedSize === size && cachedPage === page) {
    return { count: cachedCourses.length, total: cachedTotalCourses, courses: cachedCourses }
  }

  const [total, courses] = await prisma.$transaction([
    prisma.course.count(),
    prisma.course.findMany({
      where: {
        name: { contains: name?.toString(), mode: 'insensitive' },
      },
      take,
      skip,
      orderBy: {
        updatedAt: 'asc'
      }
    })
  ])

  const count = courses.length

  await programCache.setItem('get-courses', courses, { ttl: TTL_DEFAULT })
  await programCache.setItem('total-courses', total, { ttl: TTL_DEFAULT })

  // params
  await programCache.setItem('get-name-courses', name, { ttl: TTL_DEFAULT })
  await programCache.setItem('get-email-courses', email, { ttl: TTL_DEFAULT })
  await programCache.setItem('get-size-courses', size, { ttl: TTL_DEFAULT })
  await programCache.setItem('get-page-courses', page, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return { count, total, courses }
}

export const getCourseById = async (programId: string): Promise<Course> => {
  const cachedCourseById = await programCache.getItem<Course>('get-course-by-id') as Course
  const cachedCourseId = await programCache.getItem<string>('get-id-course')

  if (!isEmpty(cachedCourseById) && cachedCourseId === programId) {
    return cachedCourseById
  }

  const course = await prisma.course.findFirst({
    where: {
      id: programId
    }
  }) as Course

  await programCache.setItem('get-course-by-id', course, { ttl: TTL_DEFAULT })

  // params
  await programCache.setItem('get-id-course', programId, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return course
}

export const getCourse = async (name?: string, email?: string): Promise<Course> => {
  const cachedCourse = await programCache.getItem<Course>('get-only-course') as Course

  // params
  const cachedName = await programCache.getItem<number>('get-only-name')
  const cachedEmail = await programCache.getItem<number>('get-only-email')

  if (!isEmpty(cachedCourse) && cachedName === name && cachedEmail === email) {
    return cachedCourse
  }

  const course = await prisma.course.findFirst({
    where: {
      name: { contains: name, mode: 'insensitive' },
    }
  }) as Course

  await programCache.setItem('get-only-course', course, { ttl: TTL_DEFAULT })

  // params
  await programCache.setItem('get-only-name', name, { ttl: TTL_DEFAULT })
  await programCache.setItem('get-only-email', email, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return course
}

export const getUniqueCourse = async (where: Prisma.CourseWhereUniqueInput, select?: Prisma.CourseSelect): Promise<Course> => {
  const course = (await prisma.course.findUnique({
    where,
    select
  })) as Course

  void prisma.$disconnect()
  return course
}

export const createCourse = async (programInput: Prisma.CourseCreateInput): Promise<Course> => {
  const course = await prisma.course.create({ data: programInput })
  void prisma.$disconnect()
  return course
}

export const updateCourse = async (programId: string, programInput: Course): Promise<Course> => {
  const course = await prisma.course.update({
    where: {
      id: programId
    },
    data: programInput
  })
  void prisma.$disconnect()
  return course
}

export const deleteCourse = async (programId: string): Promise<Course> => {
  const course = await prisma.course.delete({
    where: {
      id: programId
    }
  })
  void prisma.$disconnect()
  return course
}
