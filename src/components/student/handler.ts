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
    const email = query.email?.toString()
    const page = parseInt(query.page?.toString() ?? '1')
    const limit = parseInt(query.limit?.toString() ?? '10')

    const { count, total, students } = await controller.getStudents(name, email, page, limit)

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'student list successfully', { students, count, total }))
  } catch (err) {
    res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'students_not_exist', 'Students not exist'))
  }
}

// Find only one student
export const getStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query

    const name = query.name?.toString() ?? ''
    const email = query.email?.toString() ?? ''

    const student = await controller.getStudent(name, email)

    if (isEmpty(student)) {
      res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'student_not_exist', 'Student not exist'))
      return
    }

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'find student successfully', student))
  } catch (err) {
    res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'student_not_exist', 'Student not exist'))
  }
}

// Find students
export const getStudentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const studentId: string = req.params?.id
    const student = await controller.getStudentById(studentId)

    if (isEmpty(student)) {
      res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'student_not_exist', 'Student not exist'))
      return
    }

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'student list successfully', student))
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
    const createdStudent = await controller.createStudent(req.body)

    res.status(HttpCode.CREATED).json(AppSuccess(HttpCode.CREATED, 'success', 'student created successfully', createdStudent))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'student_exist', 'Student already exist'))
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

// update student
export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const studentId: string = req.params?.id
    const updatedStudent = await controller.updateStudent(studentId, req.body)

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'student updated successfully', updatedStudent))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'student_not_exist', 'Student not exist'))
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

// delete student
export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const studentId: string = req.params?.id
    const deletedStudent = await controller.deleteStudent(studentId)

    if (deletedStudent === 0) {
      res.status(HttpCode.FORBIDDEN).json(AppSuccess(HttpCode.FORBIDDEN, 'student_not_exist', 'student not exist'))
      return
    }
    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'student deleted successfully'))

  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2014') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'student_relation_error', 'Student has relation with other table'))
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
