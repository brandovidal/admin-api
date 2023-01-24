import { PrismaClient, User } from '@prisma/client'

import { CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'

import { UsersResponse, UserResponse } from '../../interfaces/user'

import { PAGE_DEFAULT, SIZE_DEFAULT, TTL_DEFAULT } from '../../constants/repository'

const myCache = new CacheContainer(new MemoryStorage())

const prisma = new PrismaClient()

export const getUsers = async (name?: string, email?: string, page = PAGE_DEFAULT, size = SIZE_DEFAULT): Promise<UsersResponse> => {
  const take = size
  const skip = (page - 1) * take

  const cachedUsers = await myCache.getItem<User[]>('users')
  const cachedTotalUsers = await myCache.getItem<number>('totalUsers')

  // params
  const cachedName = await myCache.getItem<number>('userName')
  const cachedEmail = await myCache.getItem<number>('userEmail')
  const cachedSize = await myCache.getItem<number>('userSize')
  const cachedPage = await myCache.getItem<number>('userPage')

  if (cachedUsers !== undefined && cachedTotalUsers !== undefined && cachedName === name && cachedEmail === email && cachedSize === size && cachedPage === page) {
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

  await myCache.setItem('users', users, { ttl: TTL_DEFAULT })
  await myCache.setItem('totalUsers', total, { ttl: TTL_DEFAULT })

  // params
  await myCache.setItem('userName', name, { ttl: TTL_DEFAULT })
  await myCache.setItem('userEmail', email, { ttl: TTL_DEFAULT })
  await myCache.setItem('userSize', size, { ttl: TTL_DEFAULT })
  await myCache.setItem('userPage', page, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return { count, total, users }
}

export const getUserById = async (userId: string): Promise<User | null> => {
  const cachedUser = await myCache.getItem<User>('user')
  const cachedUserId = await myCache.getItem<string>('userId')

  if (cachedUser !== undefined && cachedUserId === userId) {
    return cachedUser
  }

  const user = await prisma.user.findFirst({
    where: {
      id: userId
    }
  })

  await myCache.setItem('user', user, { ttl: TTL_DEFAULT })

  // params
  await myCache.setItem('userId', userId, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return user
}

export const getUser = async (name?: string, email?: string): Promise<UserResponse> => {
  const cachedUser = await myCache.getItem<User>('user')

  // params
  const cachedName = await myCache.getItem<number>('userName')
  const cachedEmail = await myCache.getItem<number>('userEmail')

  if (cachedUser !== undefined && cachedName === name && cachedEmail === email) {
    return { user: cachedUser }
  }

  const user = await prisma.user.findFirst({
    where: {
      name: { contains: name, mode: 'insensitive' },
      email: { contains: email, mode: 'insensitive' }
    }
  })

  await myCache.setItem('user', user, { ttl: TTL_DEFAULT })

  // params
  await myCache.setItem('userName', name, { ttl: TTL_DEFAULT })
  await myCache.setItem('userEmail', email, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return { user }
}

export const createUser = async (userInput: User): Promise<User> => {
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
