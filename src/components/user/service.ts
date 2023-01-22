import { Prisma, PrismaClient, User } from '@prisma/client'

import { Request } from 'express'

const prisma = new PrismaClient()

export const findUsers = async (): Promise<User[]> => {
  const users = await prisma.user.findMany()
  void prisma.$disconnect()
  return users
}

export const findUserByParams = async (req: Request): Promise<User | null> => {
  const params: Prisma.UserWhereInput = req.query

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

export const createUser = async (req: Request): Promise<User> => {
  const userInput: Prisma.UserUncheckedCreateInput = req.body

  const user = await prisma.user.create({
    data: userInput
  })
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
