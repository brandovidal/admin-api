import type { Prisma, Student } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

import { CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'

import type { StudentsResponse } from '../../interfaces/student'

import { PAGE_DEFAULT, SIZE_DEFAULT, TTL_DEFAULT } from '../../constants/repository'

import isEmpty from 'just-is-empty'

export const excludedFields = ['password', 'verified', 'verificationCode']

const studentCache = new CacheContainer(new MemoryStorage())

const prisma = new PrismaClient()

export const getStudents = async (name?: string, email?: string, page = PAGE_DEFAULT, limit = SIZE_DEFAULT): Promise<StudentsResponse> => {
  const take = limit ?? SIZE_DEFAULT
  const skip = (page - 1) * take

  const cachedStudents = await studentCache.getItem<Student[]>('get-students') ?? []
  const cachedTotalStudents = await studentCache.getItem<number>('total-students') ?? 0

  // params
  const cachedName = await studentCache.getItem<number>('get-name-students')
  const cachedCode = await studentCache.getItem<number>('get-email-students')
  const cachedSize = await studentCache.getItem<number>('get-limit-students')
  const cachedPage = await studentCache.getItem<number>('get-page-students')

  if (!isEmpty(cachedStudents) && cachedName === name && cachedCode === email && cachedSize === limit && cachedPage === page) {
    return { count: cachedStudents.length, total: cachedTotalStudents, students: cachedStudents }
  }

  const [total, students] = await prisma.$transaction([
    prisma.student.count(),
    prisma.student.findMany({
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

  const count = students.length

  await studentCache.setItem('get-students', students, { ttl: TTL_DEFAULT })
  await studentCache.setItem('total-students', total, { ttl: TTL_DEFAULT })

  // params
  await studentCache.setItem('get-name-students', name, { ttl: TTL_DEFAULT })
  await studentCache.setItem('get-email-students', email, { ttl: TTL_DEFAULT })
  await studentCache.setItem('get-limit-students', limit, { ttl: TTL_DEFAULT })
  await studentCache.setItem('get-page-students', page, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return { count, total, students }
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

export const getStudent = async (name?: string, email?: string): Promise<Student> => {
  const cachedStudent = await studentCache.getItem<Student>('get-only-student') as Student

  // params
  const cachedName = await studentCache.getItem<number>('get-only-name')
  const cachedCode = await studentCache.getItem<number>('get-only-email')

  if (!isEmpty(cachedStudent) && cachedName === name && cachedCode === email) {
    return cachedStudent
  }

  const student = await prisma.student.findFirst({
    where: {
      name: { contains: name, mode: 'insensitive' },
    }
  }) as Student

  await studentCache.setItem('get-only-student', student, { ttl: TTL_DEFAULT })

  // params
  await studentCache.setItem('get-only-name', name, { ttl: TTL_DEFAULT })
  await studentCache.setItem('get-only-email', email, { ttl: TTL_DEFAULT })

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
    },
  })
  void prisma.$disconnect()
  return student.count
}
