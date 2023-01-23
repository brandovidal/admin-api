import { Prisma } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'

import { HttpCode } from '../../types/http-code'

import { createUser, findUsers, findUserByParams, removeUser, updateUser } from './service'
import { error, success } from '../../utils/message'

import isEmpty from 'just-is-empty'

// Find all users
export const findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params: Prisma.UserWhereInput = req.query
    const users = isEmpty(params) ? await findUsers() : await findUserByParams(params)

    const result = success({ status: HttpCode.OK, data: users, code: 'success', message: 'user list successfully' })
    res.json(result)
  } catch (err: any) {
    const result = error({ status: HttpCode.NO_CONTENT, code: 'no_content', message: err?.message })
    res.status(HttpCode.NO_CONTENT).json(result)
  }
}

// create user
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const createdUser = await createUser(req.body)

    const result = success({ status: HttpCode.CREATED, data: createdUser, code: 'success', message: 'user created successfully' })
    res.status(200).json(result)
  } catch (err: any) {
    const result = error({ status: HttpCode.INTERNAL_SERVER_ERROR, code: 'internal_server_error', message: 'Internal server error' })
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(result)
  }
}

// update user
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedUser = await updateUser(req)
    const result = success({ status: HttpCode.OK, data: updatedUser, code: 'success', message: 'user updated successfully' })
    res.json(result)
  } catch (err: any) {
    const result = error({ status: HttpCode.INTERNAL_SERVER_ERROR, code: 'internal_server_error', message: 'Internal server error' })
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(result)
  }
}

// delete user
export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedUser = await removeUser(req)
    const result = success({ status: HttpCode.OK, data: deletedUser, code: 'success', message: 'user deleted successfully' })
    res.json(result)
  } catch (err: any) {
    const result = error({ status: HttpCode.INTERNAL_SERVER_ERROR, code: 'internal_server_error', message: 'Internal server error' })
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(result)
  }
}
