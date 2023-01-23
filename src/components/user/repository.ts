import { Prisma, PrismaClient, User } from '@prisma/client'

import { UserModel } from '../../models/user'

const prisma = new PrismaClient()

export interface UserWhereParams extends Prisma.UserWhereInput {}

export const getUsers = async (): Promise<User[]> => {
  const users = await prisma.user.findMany()
  void prisma.$disconnect()
  return users
}

export const getUsersByParams = async (params: UserWhereParams): Promise<User[] | null> => {
  const { name, email } = params

  const users = await prisma.user.findMany({
    where: {
      name: { contains: name?.toString(), mode: 'insensitive' },
      email: { contains: email?.toString(), mode: 'insensitive' }
    }
  })

  void prisma.$disconnect()
  return users
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

export const getUserByParams = async (params: UserWhereParams): Promise<User | null> => {
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

export const createUser = async (userInput: UserModel): Promise<User> => {
  const user = await prisma.user.create({ data: userInput })
  void prisma.$disconnect()
  return user
}

export const updateUser = async (userId: string, userInput: UserModel): Promise<User> => {
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
