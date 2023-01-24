import { PrismaClient, User } from '@prisma/client'

import { UserResponse } from '../../interfaces/user'

const prisma = new PrismaClient()

export const getUsers = async (name?: string, email?: string, page = 1, size = 10): Promise<UserResponse> => {
  const take = size
  const skip = (page - 1) * take

  const [count, users] = await prisma.$transaction([
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

  void prisma.$disconnect()
  return { count, users }
}

export const getUserById = async (userId: string): Promise<User | null> => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId
    }
  })

  void prisma.$disconnect()
  return user
}

export const getUserByParams = async (params: User): Promise<User | null> => {
  const { name, email } = params

  const user = await prisma.user.findFirst({
    where: {
      name: { contains: name?.toString(), mode: 'insensitive' },
      email: { contains: email?.toString(), mode: 'insensitive' }
    }
  })

  void prisma.$disconnect()
  return user
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
