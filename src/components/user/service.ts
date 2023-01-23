import { Request } from 'express'

import { Prisma, PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient()

export const findUsers = async (): Promise<User[]> => {
  const users = await prisma.user.findMany()
  void prisma.$disconnect()
  return users
}

export const findUserById = async (query: Prisma.UserWhereUniqueInput): Promise<User | null> => {
  const { id } = query

  const user = await prisma.user.findFirst({
    where: {
      id
    }
  })

  void prisma.$disconnect()
  return user
}

export const findUserByParams = async (params: Prisma.UserWhereInput): Promise<User | null> => {
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

export const createUser = async (userInput: Prisma.UserUncheckedCreateInput): Promise<User> => {
  const user = await prisma.user.create({ data: userInput })
  void prisma.$disconnect()
  return user
}

export const updateUser = async (req: Request): Promise<User> => {
  const userId: string = req.params?.id
  const userInput: Prisma.UserUncheckedUpdateInput = req.body

  const user = await prisma.user.update({
    where: {
      id: userId
    },
    data: userInput
  })
  void prisma.$disconnect()
  return user
}

export const removeUser = async (req: Request): Promise<User> => {
  const userId: string = req.params?.id

  const user = await prisma.user.delete({
    where: {
      id: userId
    }
  })
  void prisma.$disconnect()
  return user
}
