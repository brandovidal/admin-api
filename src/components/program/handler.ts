import type { NextFunction, Request, Response } from 'express'

import isEmpty from 'just-is-empty'

import { HttpCode } from '../../types/response'

import { AppError, AppSuccess } from '../../utils'

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
    console.log("🚀 ~ file: handler.ts:24 ~ getPrograms ~ programs", programs)

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
export const getProgrambyId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const programId: string = req.params?.id
    const program = await controller.getProgramId(programId)

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'program list successfully', program))
  } catch (err) {
    res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'program_not_exist', 'Program not exist'))
  }
}

// get me program
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const programProfile = res.locals.program

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'Get me profile', programProfile))
  } catch (err) {
    next(err)
  }
}

// create program
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const createdProgram = await controller.createProgram(req.body)

    res.status(HttpCode.CREATED).json(AppSuccess(HttpCode.CREATED, 'success', 'program created successfully', createdProgram))
  } catch (err) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(AppError(HttpCode.INTERNAL_SERVER_ERROR, 'internal_server_error', 'Internal server error'))
  }
}

// update program
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const programId: string = req.params?.id
    const updatedProgram = await controller.updateProgram(programId, req.body)

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'program updated successfully', updatedProgram))
  } catch (err) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(AppError(HttpCode.INTERNAL_SERVER_ERROR, 'internal_server_error', 'Internal server error'))
  }
}

// delete program
export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const programId: string = req.params?.id
    const deletedProgram = await controller.deleteProgram(programId)

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'program deleted successfully', deletedProgram))
  } catch (err) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(AppError(HttpCode.INTERNAL_SERVER_ERROR, 'internal_server_error', 'Internal server error'))
  }
}
