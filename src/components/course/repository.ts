import type { Prisma, Course } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

import { CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'

import isEmpty from 'just-is-empty'

import { PAGE_DEFAULT, SIZE_DEFAULT, TTL_DEFAULT } from '../../constants/repository'

import { getPagination } from '../../utils/page'
import { Response } from '../../interfaces/utils/response'

const courseCache = new CacheContainer(new MemoryStorage())

const prisma = new PrismaClient()

export const getCourses = async (name?: string, email?: string, page = PAGE_DEFAULT, limit = SIZE_DEFAULT): Promise<Response<Course>> => {
  const take = limit ?? SIZE_DEFAULT
  const skip = (page - 1) * take

  const [total, data] = await prisma.$transaction([
    prisma.course.count(),
    prisma.course.findMany({
      where: {
        name: { contains: name?.toString(), mode: 'insensitive' }
      },
      take,
      skip,
      orderBy: {
        updatedAt: 'asc'
      }
    })
  ])
  void prisma.$disconnect()
  
  const meta = getPagination(page, total, take)
  return { data, meta }
}

export const getCourseById = async (courseId: string): Promise<Course> => {
  const cachedCourseById = await courseCache.getItem<Course>('get-course-by-id') as Course
  const cachedCourseId = await courseCache.getItem<string>('get-id-course')

  if (!isEmpty(cachedCourseById) && cachedCourseId === courseId) {
    return cachedCourseById
  }

  const course = await prisma.course.findFirst({
    where: {
      id: courseId
    }
  }) as Course

  await courseCache.setItem('get-course-by-id', course, { ttl: TTL_DEFAULT })

  // params
  await courseCache.setItem('get-id-course', courseId, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return course
}

export const getCourse = async (name?: string, email?: string): Promise<Course> => {
  const cachedCourse = await courseCache.getItem<Course>('get-only-course') as Course

  // params
  const cachedName = await courseCache.getItem<number>('get-only-name')
  const cachedCode = await courseCache.getItem<number>('get-only-email')

  if (!isEmpty(cachedCourse) && cachedName === name && cachedCode === email) {
    return cachedCourse
  }

  const course = await prisma.course.findFirst({
    where: {
      name: { contains: name, mode: 'insensitive' }
    }
  }) as Course

  await courseCache.setItem('get-only-course', course, { ttl: TTL_DEFAULT })

  // params
  await courseCache.setItem('get-only-name', name, { ttl: TTL_DEFAULT })
  await courseCache.setItem('get-only-email', email, { ttl: TTL_DEFAULT })

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

export const createCourse = async (courseInput: Prisma.CourseCreateInput): Promise<Course> => {
  const course = await prisma.course.create({ data: courseInput })
  void prisma.$disconnect()
  return course
}

export const updateCourse = async (courseId: string, courseInput: Course): Promise<Course> => {
  const course = await prisma.course.update({
    where: {
      id: courseId
    },
    data: courseInput
  })
  void prisma.$disconnect()
  return course
}

export const deleteCourse = async (courseId: string): Promise<number> => {
  const course = await prisma.course.deleteMany({
    where: {
      id: {
        in: [courseId]
      }
    }
  })
  void prisma.$disconnect()
  return course.count
}
