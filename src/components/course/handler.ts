import { Prisma } from '@prisma/client'
import type { NextFunction, Request, Response } from 'express'

import isEmpty from 'just-is-empty'

import { HttpCode } from '../../types/response'

import { AppError, AppSuccess, logger } from '../../utils'

import CourseController from './controller'

const controller = new CourseController()

// Find courses
export const getCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query

    const name = query.name?.toString()
    const email = query.email?.toString()
    const page = parseInt(query.page?.toString() ?? '1')
    const size = parseInt(query.size?.toString() ?? '10')

    const { count, total, courses } = await controller.getCourses(name, email, page, size)

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'course list successfully', { courses, count, total }))
  } catch (err) {
    res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'courses_not_exist', 'Courses not exist'))
  }
}

// Find only one course
export const getCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query

    const name = query.name?.toString() ?? ''
    const email = query.email?.toString() ?? ''

    const course = await controller.getCourse(name, email)

    if (isEmpty(course)) {
      res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'program_not_exist', 'Course not exist'))
      return
    }

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'find course successfully', course))
  } catch (err) {
    res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'program_not_exist', 'Course not exist'))
  }
}

// Find courses
export const getCourseById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const programId: string = req.params?.id
    const course = await controller.getCourseById(programId)

    if (isEmpty(course)) {
      res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'program_not_exist', 'Course not exist'))
      return
    }

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'course list successfully', course))
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

// create course
export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const createdCourse = await controller.createCourse(req.body)

    res.status(HttpCode.CREATED).json(AppSuccess(HttpCode.CREATED, 'success', 'course created successfully', createdCourse))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'program_exist', 'Course already exist'))
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

// update course
export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const programId: string = req.params?.id
    const updatedCourse = await controller.updateCourse(programId, req.body)

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'course updated successfully', updatedCourse))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'program_not_exist', 'Course not exist'))
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

// delete course
export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const programId: string = req.params?.id
    const deletedCourse = await controller.deleteCourse(programId)

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'course deleted successfully', deletedCourse))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'program_not_exist', 'Course not exist'))
        return
      }
    }
    next(err)
  }
}
