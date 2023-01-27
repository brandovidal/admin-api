import { type NextFunction, type Request, type Response } from 'express'
import isEmpty from 'just-is-empty'

import { HttpCode } from '../../types/response'
import { error, success } from '../../utils/message'

import UserController from './controller'

const controller = new UserController()

// Find users
export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query

    const name = query.name?.toString()
    const email = query.email?.toString()
    const page = parseInt(query.page?.toString() ?? '1')
    const size = parseInt(query.size?.toString() ?? '10')

    const { count, total, users } = await controller.getUsers(name, email, page, size)

    const result = success({ status: HttpCode.OK, data: users, count, total, code: 'success', message: 'user list successfully' })
    res.json(result)
  } catch (err) {
    const result = error({ status: HttpCode.FORBIDDEN, code: 'users_not_exist', message: 'Users not exist' })
    res.status(HttpCode.FORBIDDEN).json(result)
  }
}

// Find only one user
export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query

    const name = query.name?.toString() ?? ''
    const email = query.email?.toString() ?? ''

    const { user } = await controller.getUser(name, email)

    if (isEmpty(user)) {
      const result = error({ status: HttpCode.FORBIDDEN, code: 'user_not_exist', message: 'User not exist' })
      res.status(HttpCode.FORBIDDEN).json(result)
      return
    }

    const result = success({ status: HttpCode.OK, data: user, count: 1, code: 'success', message: 'find user successfully' })
    res.json(result)
  } catch (err) {
    const result = error({ status: HttpCode.FORBIDDEN, code: 'user_not_exist', message: 'User not exist' })
    res.status(HttpCode.FORBIDDEN).json(result)
  }
}

// Find users
export const getUserbyId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = req.params?.id
    const user = await controller.getUserId(userId)

    const result = success({ status: HttpCode.OK, data: user, code: 'success', message: 'user list successfully' })
    res.json(result)
  } catch (err) {
    const result = error({ status: HttpCode.FORBIDDEN, code: 'user_not_exist', message: 'User not exist' })
    res.status(HttpCode.FORBIDDEN).json(result)
  }
}

// create user
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const createdUser = await controller.createUser(req.body)

    const result = success({ status: HttpCode.CREATED, data: createdUser, code: 'success', message: 'user created successfully' })
    res.status(200).json(result)
  } catch (err) {
    const result = error({ status: HttpCode.INTERNAL_SERVER_ERROR, code: 'internal_server_error', message: 'Internal server error' })
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(result)
  }
}

export const getMeHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = res.locals.user

    const result = success({ status: HttpCode.OK, data: user, code: 'success', message: 'get User Me' })
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}

// update user
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: string = req.params?.id
    const updatedUser = await controller.updateUser(userId, req.body)

    const result = success({ status: HttpCode.OK, data: updatedUser, code: 'success', message: 'user updated successfully' })
    res.json(result)
  } catch (err) {
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
  } catch (err) {
    const result = error({ status: HttpCode.INTERNAL_SERVER_ERROR, code: 'internal_server_error', message: 'Internal server error' })
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(result)
  }
}
