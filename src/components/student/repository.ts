import type { Prisma, Student } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

import { CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'

import isEmpty from 'just-is-empty'

import { PAGE_DEFAULT, SIZE_DEFAULT, TTL_DEFAULT } from '../../constants/repository'


import { getPagination } from '../../utils/page'

import {type Response } from '../../interfaces/utils/response'

const studentCache = new CacheContainer(new MemoryStorage())

const prisma = new PrismaClient()

export const getStudents = async (name?: string, dni?: string, page = PAGE_DEFAULT, limit = SIZE_DEFAULT): Promise<Response<Student>> => {
  const take = limit ?? SIZE_DEFAULT
  const skip = (page - 1) * take

  const [total, data] = await prisma.$transaction([
    prisma.student.count(),
    prisma.student.findMany({
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
export const getStudent = async (name: string, dni: number): Promise<Student> => {
  const cachedStudent = await studentCache.getItem<Student>('get-only-student') as Student

  // params
  const cachedName = await studentCache.getItem<string>('get-only-name')
  const cachedDni = await studentCache.getItem<number>('get-only-dni')

  if (!isEmpty(cachedStudent) && cachedName === name && cachedDni === dni) {
    return cachedStudent
  }

  const whereAnd : Prisma.StudentWhereInput[] = []

  if (!isEmpty(name)) {
    whereAnd.push({ name: { contains: name, mode: 'insensitive' } })
  }
  if (dni > 0) {
    whereAnd.push({ dni })
  }

  const student = await prisma.student.findFirstOrThrow({
    where: {
      AND: whereAnd
    }
  }) as Student

  await studentCache.setItem('get-only-student', student, { ttl: TTL_DEFAULT })

  // params
  await studentCache.setItem('get-only-name', name, { ttl: TTL_DEFAULT })
  await studentCache.setItem('get-only-dni', dni, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return student
}

export const getStudentById = async (studentId: string): Promise<Student> => {
  const cachedStudentById = await studentCache.getItem<Student>('get-student-by-id') as Student
  const cachedStudentId = await studentCache.getItem<string>('get-id-student')

  if (!isEmpty(cachedStudentById) && cachedStudentId === studentId) {
    return cachedStudentById
  }

  const student = await prisma.student.findFirst({
    where: {
      id: studentId
    }
  }) as Student

  await studentCache.setItem('get-student-by-id', student, { ttl: TTL_DEFAULT })

  // params
  await studentCache.setItem('get-id-student', studentId, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return student
}


export const getUniqueStudent = async (where: Prisma.StudentWhereUniqueInput, select?: Prisma.StudentSelect): Promise<Student> => {
  const student = (await prisma.student.findUnique({
    where,
    select
  })) as Student

  void prisma.$disconnect()
  return student
}

export const createStudent = async (studentInput: Prisma.StudentCreateInput): Promise<Student> => {
  const student = await prisma.student.create({ data: studentInput })
  void prisma.$disconnect()
  return student
}

export const updateStudent = async (studentId: string, studentInput: Student): Promise<Student> => {
  const student = await prisma.student.update({
    where: {
      id: studentId
    },
    data: studentInput
  })
  void prisma.$disconnect()
  return student
}

export const deleteStudent = async (studentId: string): Promise<number> => {
  const student = await prisma.student.deleteMany({
    where: {
      id: {
        in: [studentId]
      }
    }
  })
  void prisma.$disconnect()
  return student.count
}
