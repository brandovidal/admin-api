import { Prisma } from '@prisma/client'
import type { NextFunction, Request, Response } from 'express'

import isEmpty from 'just-is-empty'

import { HttpCode } from '../../types/response'

import { AppError, AppSuccess, logger } from '../../utils'

import UserController from './controller'

const controller = new UserController()

// Find users
export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query

    const name = query.name?.toString()
    const email = query.email?.toString()
    const page = parseInt(query.page?.toString() ?? '1')
    const limit = parseInt(query.limit?.toString() ?? '10')

    const { data, meta } = await controller.getUsers(name, email, page, limit)

    res.status(HttpCode.OK).json(AppSuccess(data, meta))
  } catch (err) {
    res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'users_not_exist', 'Users not exist'))
  }
}

// Find only one user
export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query

    const name = query.name?.toString() ?? ''
    const email = query.email?.toString() ?? ''

    const data = await controller.getUser(name, email)

    if (isEmpty(data)) {
      res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'user_not_exist', 'User not exist'))
      return
    }

    res.status(HttpCode.OK).json(AppSuccess(data))
  } catch (err) {
    next(err)
  }
}

// Find users
export const getUserbyId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = req.params?.id
    const data = await controller.getUserId(userId)

    if (isEmpty(data)) {
      res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'id_error', 'ID malformed, please check again'))
      return
    }

    res.status(HttpCode.OK).json(AppSuccess(data))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2023') {
        res
          .status(HttpCode.CONFLICT)
          .json(AppError(HttpCode.CONFLICT, 'user_id_error', 'User  id malformed, please check again'))
        return
      }
    }
    next(err)
  }
}

// get me user
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = res.locals.user

    res.status(HttpCode.OK).json(AppSuccess(data))
  } catch (err) {
    next(err)
  }
}

// create user
export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await controller.createUser(req.body)

    res.status(HttpCode.CREATED).json(AppSuccess(data))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'user_exist', 'User already exist'))
        return
      }
    }
    if (err instanceof Prisma.PrismaClientValidationError) {
      res
        .status(HttpCode.CONFLICT)
        .json(AppError(HttpCode.CONFLICT, 'prisma_validation_error', 'Error de validación de campos'))
      return
    }
    next(err)
  }
}

// update user
export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = req.params?.id
    const data = await controller.updateUser(userId, req.body)

    res.status(HttpCode.OK).json(AppSuccess(data))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'user_not_exist', 'User not exist'))
        return
      }
    }
    if (err instanceof Prisma.PrismaClientValidationError) {
      logger.error(err)
      res
        .status(HttpCode.CONFLICT)
        .json(AppError(HttpCode.CONFLICT, 'prisma_validation_error', 'Error de validación de campos'))
      return
    }
    next(err)
  }
}
// update user status
export const updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = req.params?.id
    const data = await controller.updateUser(userId, req.body)

    res.status(HttpCode.OK).json(AppSuccess(data))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'user_not_exist', 'User not exist'))
        return
      }
    }
    if (err instanceof Prisma.PrismaClientValidationError) {
      logger.error(err)
      res
        .status(HttpCode.CONFLICT)
        .json(AppError(HttpCode.CONFLICT, 'prisma_validation_error', 'Error de validación de campos'))
      return
    }
    next(err)
  }
}

// delete user
export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = req.params?.id
    await controller.deleteUser(userId)

    res.status(HttpCode.OK).json(AppSuccess(null))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'user_not_exist', 'User not exist'))
        return
      }
    }
    next(err)
  }
}
