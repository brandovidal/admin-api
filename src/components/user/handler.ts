import { NextFunction, Request, Response } from 'express'

import { HttpCode } from '../../types/http-code'
import { error, success } from '../../utils/message'

import UserController from './controller'

const controller = new UserController()

// Find all users
export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await controller.getUsers()

    const result = success({ status: HttpCode.OK, data: users, code: 'success', message: 'user list successfully' })
    res.json(result)
  } catch (err: any) {
    const result = error({ status: HttpCode.NO_CONTENT, code: 'no_content', message: err?.message })
    res.status(HttpCode.NO_CONTENT).json(result)
  }
}

export const getUserbyId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = req.params?.id
    const user = await controller.getUserId(userId)

    const result = success({ status: HttpCode.OK, data: user, code: 'success', message: 'user list successfully' })
    res.json(result)
  } catch (err: any) {
    const result = error({ status: HttpCode.NO_CONTENT, code: 'no_content', message: err?.message })
    res.status(HttpCode.NO_CONTENT).json(result)
  }
}

export const getUsersPaginate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query

    const nameParam = query.name?.toString() ?? ''
    const emailParam = query.email?.toString() ?? ''
    const page = parseInt(query.page?.toString() ?? '1')
    const size = parseInt(query.size?.toString() ?? '10')

    const { count, users } = await controller.getUsersPaginate(nameParam, emailParam, page, size)

    const result = success({ status: HttpCode.OK, data: users, count, code: 'success', message: 'user list successfully' })
    res.json(result)
  } catch (err: any) {
    console.error('🚀 ~ file: handler.ts:46 ~ getUsersPaginate ~ err', err)
    const result = error({ status: HttpCode.NO_CONTENT, code: 'no_content', message: err?.message })
    res.status(HttpCode.NO_CONTENT).json(result)
  }
}

// create user
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const createdUser = await controller.createUser(req.body)

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
    const userId: string = req.params?.id
    const updatedUser = await controller.updateUser(userId, req.body)

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
    const userId: string = req.params?.id
    const deletedUser = await controller.deleteUser(userId)

    const result = success({ status: HttpCode.OK, data: deletedUser, code: 'success', message: 'user deleted successfully' })
    res.json(result)
  } catch (err: any) {
    const result = error({ status: HttpCode.INTERNAL_SERVER_ERROR, code: 'internal_server_error', message: 'Internal server error' })
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(result)
  }
}
