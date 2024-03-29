import type { Prisma, Program } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

import { CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'

import isEmpty from 'just-is-empty'

import { PAGE_DEFAULT, SIZE_DEFAULT, TTL_DEFAULT } from '../../constants/repository'

import { getPagination } from '../../utils/page'

import { Response } from '../../interfaces/utils/response'

const programCache = new CacheContainer(new MemoryStorage())

const prisma = new PrismaClient()

export const getPrograms = async (name?: string, code?: string, page = PAGE_DEFAULT, limit = SIZE_DEFAULT): Promise<Response<Program>> => {
  const take = limit ?? SIZE_DEFAULT
  const skip = (page - 1) * take


  const [total, data] = await prisma.$transaction([
    prisma.program.count(),
    prisma.program.findMany({
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

export const getProgramById = async (programId: string): Promise<Program> => {
  const cachedProgramById = await programCache.getItem<Program>('get-program-by-id') as Program
  const cachedProgramId = await programCache.getItem<string>('get-id-program')

  if (!isEmpty(cachedProgramById) && cachedProgramId === programId) {
    return cachedProgramById
  }

  const program = await prisma.program.findFirst({
    where: {
      id: programId
    }
  }) as Program

  await programCache.setItem('get-program-by-id', program, { ttl: TTL_DEFAULT })

  // params
  await programCache.setItem('get-id-program', programId, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return program
}

export const getProgram = async (name?: string, code?: string): Promise<Program> => {
  const cachedProgram = await programCache.getItem<Program>('get-only-program') as Program

  // params
  const cachedName = await programCache.getItem<number>('get-only-name')
  const cachedCode = await programCache.getItem<number>('get-only-code')

  if (!isEmpty(cachedProgram) && cachedName === name && cachedCode === code) {
    return cachedProgram
  }

  const program = await prisma.program.findFirst({
    where: {
      name: { contains: name, mode: 'insensitive' }
    }
  }) as Program

  await programCache.setItem('get-only-program', program, { ttl: TTL_DEFAULT })

  // params
  await programCache.setItem('get-only-name', name, { ttl: TTL_DEFAULT })
  await programCache.setItem('get-only-code', code, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return program
}

export const getUniqueProgram = async (where: Prisma.ProgramWhereUniqueInput, select?: Prisma.ProgramSelect): Promise<Program> => {
  const program = (await prisma.program.findUnique({
    where,
    select
  })) as Program

  void prisma.$disconnect()
  return program
}

export const createProgram = async (programInput: Prisma.ProgramCreateInput): Promise<Program> => {
  const program = await prisma.program.create({ data: programInput })
  void prisma.$disconnect()
  return program
}

export const updateProgram = async (programId: string, programInput: Program): Promise<Program> => {
  const program = await prisma.program.update({
    where: {
      id: programId
    },
    data: programInput
  })
  void prisma.$disconnect()
  return program
}

export const deleteProgram = async (programId: string): Promise<Program> => {
  const program = await prisma.program.delete({
    where: {
      id: programId
    }
  })
  void prisma.$disconnect()
  return program
}
