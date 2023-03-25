import type { Prisma, User } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

import { CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'

import type { UsersResponse } from '../../interfaces/user'

import { PAGE_DEFAULT, SIZE_DEFAULT, TTL_DEFAULT } from '../../constants/repository'

import isEmpty from 'just-is-empty'

export const excludedFields = ['password', 'verified', 'verificationCode']

const userCache = new CacheContainer(new MemoryStorage())

const prisma = new PrismaClient()

export const getUsers = async (name?: string, email?: string, page = PAGE_DEFAULT, limit = SIZE_DEFAULT, revalidate = 'NONE'): Promise<UsersResponse> => {
  const take = limit ?? SIZE_DEFAULT
  const skip = (page - 1) * take

  const cachedUsers = await userCache.getItem<User[]>('get-users') ?? []
  const cachedTotalUsers = await userCache.getItem<number>('total-users') ?? 0

  // params
  const cachedName = await userCache.getItem<number>('get-name-users')
  const cachedEmail = await userCache.getItem<number>('get-email-users')
  const cachedSize = await userCache.getItem<number>('get-limit-users')
  const cachedPage = await userCache.getItem<number>('get-page-users')

  if (!isEmpty(cachedUsers) && cachedName === name && cachedEmail === email && cachedSize === limit && cachedPage === page && revalidate === 'NONE') {
    return { count: cachedUsers.length, total: cachedTotalUsers, users: cachedUsers }
  }

  const [total, users] = await prisma.$transaction([
    prisma.user.count(),
    prisma.user.findMany({
      where: {
        name: { contains: name?.toString(), mode: 'insensitive' },
        email: { contains: email?.toString(), mode: 'insensitive' }
      },
      take,
      skip,
      orderBy: {
        updatedAt: 'asc'
      }
    })
  ])

  const count = users.length

  await userCache.setItem('get-users', users, { ttl: TTL_DEFAULT })
  await userCache.setItem('total-users', total, { ttl: TTL_DEFAULT })

  // params
  await userCache.setItem('get-name-users', name, { ttl: TTL_DEFAULT })
  await userCache.setItem('get-email-users', email, { ttl: TTL_DEFAULT })
  await userCache.setItem('get-limit-users', limit, { ttl: TTL_DEFAULT })
  await userCache.setItem('get-page-users', page, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return { count, total, users }
}

export const getUserById = async (userId: string): Promise<User | null> => {
  const cachedUserById = await userCache.getItem<User>('get-user-by-id') ?? null
  const cachedUserId = await userCache.getItem<string>('get-id-user')

  if (!isEmpty(cachedUserById) && cachedUserId === userId) {
    return cachedUserById
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  }) as User

  await userCache.setItem('get-user-by-id', user, { ttl: TTL_DEFAULT })

  // params
  await userCache.setItem('get-id-user', userId, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return user
}

export const getUser = async (name?: string, email?: string): Promise<User> => {
  const cachedUser = await userCache.getItem<User>('get-only-user') as User

  // params
  const cachedName = await userCache.getItem<number>('get-only-name')
  const cachedEmail = await userCache.getItem<number>('get-only-email')

  if (!isEmpty(cachedUser) && cachedName === name && cachedEmail === email) {
    return cachedUser
  }

  const user = await prisma.user.findFirst({
    where: {
      name: { contains: name, mode: 'insensitive' },
      email: { contains: email, mode: 'insensitive' }
    }
  }) as User

  await userCache.setItem('get-only-user', user, { ttl: TTL_DEFAULT })

  // params
  await userCache.setItem('get-only-name', name, { ttl: TTL_DEFAULT })
  await userCache.setItem('get-only-email', email, { ttl: TTL_DEFAULT })

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
  const user = await prisma.user.create({ data: userInput })
  void prisma.$disconnect()
  return user
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
