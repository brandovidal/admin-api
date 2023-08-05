import type { Prisma, User } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

import { CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'

import isEmpty from 'just-is-empty'
import omit from 'just-omit'

import { PAGE_DEFAULT, SIZE_DEFAULT, TTL_DEFAULT } from '../../constants/repository'

import { getPagination } from '../../utils/page'
import { generateHash, generateRandomCode } from '../../utils/hash'

import { type Response } from '../../interfaces/utils/response'

export const excludedFields = ['password', 'verified', 'verificationCode'] as const

const userCache = new CacheContainer(new MemoryStorage())

const prisma = new PrismaClient()

export const getUsers = async (
  name?: string,
  email?: string,
  page = PAGE_DEFAULT,
  limit = SIZE_DEFAULT
): Promise<Response<User>> => {
  const take = limit ?? SIZE_DEFAULT
  const skip = (page - 1) * take

  const [total, data] = await prisma.$transaction([
    prisma.user.count(),
    prisma.user.findMany({
      where: {
        name: { contains: name?.toString(), mode: 'insensitive' },
        email: { contains: email?.toString(), mode: 'insensitive' }
      },
      take,
      skip,
      orderBy: {
        createdAt: 'desc'
      }
    })
  ])
  void prisma.$disconnect()

  const meta = getPagination(page, total, take)
  return { data, meta }
}

export const getUser = async (name?: string, email?: string): Promise<User> => {
  const cachedUser = (await userCache.getItem<User>('get-only-user')) as User

  // params
  const cachedName = await userCache.getItem<number>('get-only-name')
  const cachedEmail = await userCache.getItem<number>('get-only-email')

  if (!isEmpty(cachedUser) && cachedName === name && cachedEmail === email) {
    return cachedUser
  }

  const user = (await prisma.user.findFirst({
    where: {
      name: { contains: name, mode: 'insensitive' },
      email: { contains: email, mode: 'insensitive' }
    }
  })) as User

  await userCache.setItem('get-only-user', user, { ttl: TTL_DEFAULT })

  // params
  await userCache.setItem('get-only-name', name, { ttl: TTL_DEFAULT })
  await userCache.setItem('get-only-email', email, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return user
}

export const getUserById = async (userId: string): Promise<User | null> => {
  const cachedUserById = (await userCache.getItem<User>('get-user-by-id')) ?? null
  const cachedUserId = await userCache.getItem<string>('get-id-user')

  if (!isEmpty(cachedUserById) && cachedUserId === userId) {
    return cachedUserById
  }

  const user = (await prisma.user.findUnique({
    where: {
      id: userId
    }
  })) as User

  await userCache.setItem('get-user-by-id', user, { ttl: TTL_DEFAULT })

  // params
  await userCache.setItem('get-id-user', userId, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return user
}

export const getUniqueUser = async (where: Prisma.UserWhereUniqueInput, select?: Prisma.UserSelect): Promise<User> => {
  const user = (await prisma.user.findUnique({
    where,
    select
  })) as User

  void prisma.$disconnect()
  return user
}

export const createUser = async (userInput: Prisma.UserCreateInput): Promise<User> => {
  const { password } = userInput

  const hashedPassword = await generateHash(password)
  const verificationCode = await generateRandomCode()
  
  const data: Prisma.UserCreateInput = {
    username: userInput.username,
    name: userInput.name,
    email: userInput.email.toLowerCase(),
    password: hashedPassword,
    verificationCode,
    verified: false
  }

  const user = await prisma.user.create({ data })
  void prisma.$disconnect()

  const createUser = omit(user, [...excludedFields]) as User
  return createUser
}

export const updateUser = async (userId: string, userInput: User): Promise<User> => {
  const user = await prisma.user.update({
    where: {
      id: userId
    },
    data: userInput
  })
  void prisma.$disconnect()
  return user
}

export const deleteUser = async (userId: string): Promise<User> => {
  const user = await prisma.user.delete({
    where: {
      id: userId
    }
  })
  void prisma.$disconnect()
  return user
}
