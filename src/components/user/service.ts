import { Prisma, PrismaClient, User } from '@prisma/client'

import { Request } from 'express'

const prisma = new PrismaClient()

export const findUser = async (): Promise<User[]> => {
  return await prisma.user.findMany()
}

export const findUserByParams = async (req: Request): Promise<User | null> => {
  const params: Prisma.UserWhereInput = req.query

  const { name, email } = params

  return await prisma.user.findFirst({
    where: {
      name: { contains: name?.toString(), mode: 'insensitive' },
      email: { contains: email?.toString(), mode: 'insensitive' }
    }
  })
}

export const createUser = async (req: Request): Promise<User> => {
  const userInput: Prisma.UserUncheckedCreateInput = req.body

  return await prisma.user.create({
    data: userInput
  })
}

export const updateUser = async (req: Request): Promise<User> => {
  const userId: string = req.params?.id
  const userInput: Prisma.UserUncheckedUpdateInput = req.body

  return await prisma.user.update({
    where: {
      id: userId
    },
    data: userInput
  })
}

export const removeUser = async (req: Request): Promise<User> => {
  const userId: string = req.params?.id

  return await prisma.user.delete({
    where: {
      id: userId
    }
  })
}
