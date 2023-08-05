import { Prisma } from '@prisma/client'
import type { NextFunction, Request, Response } from 'express'

import isEmpty from 'just-is-empty'

import { HttpCode } from '../../types/response'

import { AppError, AppSuccess, logger } from '../../utils'

import EnrollmentController from './controller'

const controller = new EnrollmentController()

// Find enrollments
export const getEnrollments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query

    const startDate = query.startDate?.toString()
    const endDate = query.endDate?.toString()
    const page = parseInt(query.page?.toString() ?? '1')
    const limit = parseInt(query.limit?.toString() ?? '10')

    const { data, meta } = await controller.getEnrollments(startDate, endDate, page, limit)

    res.status(HttpCode.OK).json(AppSuccess(data, meta))
  } catch (err) {
    res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'enrollments_not_exist', 'Enrollments not exist'))
  }
}

// Find only one enrollment
export const getEnrollment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query

    const startDate = query.startDate?.toString() ?? ''
    const endDate = query.endDate?.toString() ?? ''

    const data = await controller.getEnrollment(startDate, endDate)

    if (isEmpty(data)) {
      res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'enrollment_not_exist', 'Enrollment not exist'))
      return
    }

    res.status(HttpCode.OK).json(AppSuccess(data))
  } catch (err) {
    res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'enrollment_not_exist', 'Enrollment not exist'))
  }
}

// Find enrollments
export const getEnrollmentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const enrollmentId: string = req.params?.id
    const data = await controller.getEnrollmentById(enrollmentId)

    if (isEmpty(data)) {
      res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'enrollment_not_exist', 'Enrollment not exist'))
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

// create enrollment
export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await controller.createEnrollment(req.body)

    res.status(HttpCode.CREATED).json(AppSuccess(data))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'enrollment_exist', 'Enrollment already exist'))
        return
      }
    }
    if (err instanceof Prisma.PrismaClientValidationError) {
      logger.error(err.message)
      res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'prisma_validation_error', 'Error de validación de campos'))
      return
    }
    next(err)
  }
}

// update enrollment
export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const enrollmentId: string = req.params?.id
    const data = await controller.updateEnrollment(enrollmentId, req.body)

    res.status(HttpCode.OK).json(AppSuccess(data))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'enrollment_not_exist', 'Enrollment not exist'))
        return
      }
    }
    if (err instanceof Prisma.PrismaClientValidationError) {
      res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'prisma_validation_error', 'Error de validación de campos'))
      return
    }
    next(err)
  }
}

// delete enrollment
export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const enrollmentId: string = req.params?.id
    await controller.deleteEnrollment(enrollmentId)

    res.status(HttpCode.OK).json(AppSuccess(null))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2014') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'enrollment_relation_error', 'Enrollment has relation with other table'))
        return
      }
      if (err.code === 'P2025') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'enrollment_not_exist', 'Enrollment not exist'))
        return
      }
    }
    next(err)
  }
}
