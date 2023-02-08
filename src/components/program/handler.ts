import { Prisma } from '@prisma/client'
import type { NextFunction, Request, Response } from 'express'

import isEmpty from 'just-is-empty'

import { HttpCode } from '../../types/response'

import { AppError, AppSuccess, logger } from '../../utils'

import ProgramController from './controller'

const controller = new ProgramController()

// Find programs
export const getPrograms = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query

    const name = query.name?.toString()
    const email = query.email?.toString()
    const page = parseInt(query.page?.toString() ?? '1')
    const size = parseInt(query.size?.toString() ?? '10')

    const { count, total, programs } = await controller.getPrograms(name, email, page, size)

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'program list successfully', { programs, count, total }))
  } catch (err) {
    res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'programs_not_exist', 'Programs not exist'))
  }
}

// Find only one program
export const getProgram = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query

    const name = query.name?.toString() ?? ''
    const email = query.email?.toString() ?? ''

    const program = await controller.getProgram(name, email)

    if (isEmpty(program)) {
      res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'program_not_exist', 'Program not exist'))
      return
    }

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'find program successfully', program))
  } catch (err) {
    res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'program_not_exist', 'Program not exist'))
  }
}

// Find programs
export const getProgramById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const programId: string = req.params?.id
    const program = await controller.getProgramById(programId)

    if (isEmpty(program)) {
      res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'program_not_exist', 'Program not exist'))
      return
    }

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'program list successfully', program))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2023') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'id_error', 'ID malformed, please check again'))
        return
      }
    }
    next(err)
  }
}

// create program
export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const createdProgram = await controller.createProgram(req.body)

    res.status(HttpCode.CREATED).json(AppSuccess(HttpCode.CREATED, 'success', 'program created successfully', createdProgram))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'program_exist', 'Program already exist'))
        return
      }
    }
    if (err instanceof Prisma.PrismaClientValidationError) {
      logger.error(err.message)
      res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'error_validation', 'Error de validación de campos'))
      return
    }
    next(err)
  }
}

// update program
export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const programId: string = req.params?.id
    const updatedProgram = await controller.updateProgram(programId, req.body)

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'program updated successfully', updatedProgram))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'program_not_exist', 'Program not exist'))
        return
      }
    }
    if (err instanceof Prisma.PrismaClientValidationError) {
      res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'error_validation', 'Error de validación de campos'))
      return
    }
    next(err)
  }
}

// delete program
export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const programId: string = req.params?.id
    const deletedProgram = await controller.deleteProgram(programId)

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'program deleted successfully', deletedProgram))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'program_not_exist', 'Program not exist'))
        return
      }
    }
    next(err)
  }
}
