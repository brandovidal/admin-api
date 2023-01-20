import { Prisma, PrismaClient } from '@prisma/client'

import { Request, Response } from 'express'

import { error, success } from '../../utils/message'

const prisma = new PrismaClient()

// Find all users
export const find = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany()
    console.log('🚀 ~ file: controller.ts:15 ~ find ~ users', users)

    const result = success(users)
    res.json(result)
  } catch (err: any) {
    console.error(err)

    const result = error(err.code, err.message)
    res.json(result)
  }
}

// create user
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const userInput: Prisma.UserUncheckedCreateInput = req.body

    const createdUser = await prisma.user.create({
      data: userInput
    })

    const result = success(createdUser)
    res.json(result)
  } catch (err: any) {
    console.error(err)

    const result = error(err.code, err.message)
    res.json(result)
  }
}

// update user
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: string = req.params?.id
    const userInput: Prisma.UserUncheckedUpdateInput = req.body

    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: userInput
    })

    const result = success(updatedUser)
    res.json(result)
  } catch (err: any) {
    console.error(err)

    const result = error(err.code, err.message)
    res.json(result)
  }
}

// delete user
export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: string = req.params?.id

    const deletedUser = await prisma.user.delete({
      where: {
        id: userId
      }
    })

    const result = success({ message: `User ${deletedUser.name} deleted successfully` })
    res.json(result)
  } catch (err: any) {
    console.error(err)

    const result = error(err.code, err.message)
    res.json(result)
  }
}
