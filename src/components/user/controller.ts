import { Prisma } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'

import { error, HttpCode, success } from '../../utils/message'

import { createUser, findUsers, findUserByParams, removeUser, updateUser } from './service'

import isEmpty from 'just-is-empty'
import { userSchema } from './schema'

// Find all users
export const findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params: Prisma.UserWhereInput = req.query

    const users = isEmpty(params) ? await findUsers() : await findUserByParams(req)

    const result = success(HttpCode.OK, users, 'user list')
    res.json(result)
  } catch (err: any) {
    console.error(err?.code, err?.message)

    const result = error(err?.code, err?.message)
    res.json(result)
  }
}

// create user
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const validate = userSchema.parse(req.body)
    console.log('🚀 ~ file: controller.ts:32 ~ create ~ validate', validate)

    const createdUser = await createUser(req)
    const result = success(HttpCode.CREATED, createdUser, 'user created')
    res.status(200).json(result)
  } catch (err: any) {
    console.error(err.message)

    const userExist = 'users_email_key'
    const badRequest = 'missing'

    const message = String(err.message)
    if (message.includes(userExist)) {
      const result = error(HttpCode.FORBIDDEN, 'User already exists')
      res.status(HttpCode.FORBIDDEN).json(result)
      return
    } else if (message.includes(badRequest)) {
      const result = error(HttpCode.BAD_REQUEST, 'User params is missing')
      res.status(HttpCode.BAD_REQUEST).json(result)
      return
    }

    const result = error(err.code, err.message)
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(result)
  }
}

// update user
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedUser = await updateUser(req)
    const result = success(HttpCode.OK, updatedUser, 'user updated')
    res.json(result)
  } catch (err: any) {
    console.error(err.message)

    const badRequest = 'missing'

    const message = String(err.message)
    if (message.includes(badRequest)) {
      const result = error(HttpCode.BAD_REQUEST, 'User params is missing')
      res.status(HttpCode.BAD_REQUEST).json(result)
      return
    }

    const result = error(err.code, err.message)
    res.json(result)
  }
}

// delete user
export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedUser = await removeUser(req)
    const result = success(HttpCode.OK, deletedUser, `User ${deletedUser.name} deleted successfully`)
    res.json(result)
  } catch (err: any) {
    console.error(err.message)

    const badRequest = 'missing'

    const message = String(err.message)
    if (message.includes(badRequest)) {
      const result = error(HttpCode.BAD_REQUEST, 'User params is missing')
      res.status(HttpCode.BAD_REQUEST).json(result)
      return
    }

    const result = error(err.code, err.message)
    res.json(result)
  }
}
