import { Prisma } from '@prisma/client'
import type { NextFunction, Request, Response } from 'express'

import isEmpty from 'just-is-empty'

import { HttpCode } from '../../types/response'

import { AppError, AppSuccess, logger } from '../../utils'

import StudentController from './controller'

const controller = new StudentController()

// Find students
export const getStudents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query

    const name = query.name?.toString()
    const dni = query.dni?.toString()
    const page = Number(query.page?.toString() ?? '1')
    const limit = Number(query.limit?.toString() ?? '10')

    const { data, meta } = await controller.getStudents(name, dni, page, limit)

    res.status(HttpCode.OK).json(AppSuccess(data, meta))
  } catch (err) {
    res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'students_not_exist', 'Students not exist'))
  }
}

// Find only one student
export const getStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query

    const name = query.name?.toString() ?? ''
    const dni = Number(query.dni?.toString() ?? '0')

    const data = await controller.getStudent(name, dni)

    if (isEmpty(data)) {
      res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'student_not_exist', 'Student not exist'))
      return
    }

    res.status(HttpCode.OK).json(AppSuccess(data))
  } catch (err) {
    res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'student_not_exist', 'Student not exist'))
  }
}

// Find students
export const getStudentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const studentId: string = req.params?.id
    const data = await controller.getStudentById(studentId)

    if (isEmpty(data)) {
      res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'student_not_exist', 'Student not exist'))
      return
    }

    res.status(HttpCode.OK).json(AppSuccess(data))
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

// create student
export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await controller.createStudent(req.body)

    res.status(HttpCode.CREATED).json(AppSuccess(data))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'student_exist', 'Student already exist'))
        return
      }
    }
    if (err instanceof Prisma.PrismaClientValidationError) {
      logger.error(err.message)
      res
        .status(HttpCode.CONFLICT)
        .json(AppError(HttpCode.CONFLICT, 'prisma_validation_error', 'Error de validación de campos'))
      return
    }
    next(err)
  }
}

// update student
export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const studentId: string = req.params?.id
    const data = await controller.updateStudent(studentId, req.body)

    res.status(HttpCode.OK).json(AppSuccess(data))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'student_not_exist', 'Student not exist'))
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

// delete student
export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const studentId: string = req.params?.id
    const count = await controller.deleteStudent(studentId)

    if (count === 0) {
      res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'student_not_exist', 'Student not exist'))
      return
    }

    res.status(HttpCode.OK).json(AppSuccess(null))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2014') {
        res
          .status(HttpCode.CONFLICT)
          .json(AppError(HttpCode.CONFLICT, 'student_relation_error', 'Student has relation with other table'))
        return
      }
      if (err.code === 'P2025') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'student_not_exist', 'Student not exist'))
        return
      }
    }
    next(err)
  }
}
