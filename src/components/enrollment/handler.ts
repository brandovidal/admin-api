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

    const name = query.name?.toString()
    const email = query.email?.toString()
    const page = parseInt(query.page?.toString() ?? '1')
    const size = parseInt(query.size?.toString() ?? '10')

    const { count, total, enrollments } = await controller.getEnrollments(name, email, page, size)

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'enrollment list successfully', { enrollments, count, total }))
  } catch (err) {
    res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'enrollments_not_exist', 'Enrollments not exist'))
  }
}

// Find only one enrollment
export const getEnrollment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query

    const name = query.name?.toString() ?? ''
    const email = query.email?.toString() ?? ''

    const enrollment = await controller.getEnrollment(name, email)

    if (isEmpty(enrollment)) {
      res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'enrollment_not_exist', 'Enrollment not exist'))
      return
    }

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'find enrollment successfully', enrollment))
  } catch (err) {
    res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'enrollment_not_exist', 'Enrollment not exist'))
  }
}

// Find enrollments
export const getEnrollmentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const enrollmentId: string = req.params?.id
    const enrollment = await controller.getEnrollmentById(enrollmentId)

    if (isEmpty(enrollment)) {
      res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'enrollment_not_exist', 'Enrollment not exist'))
      return
    }

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'enrollment list successfully', enrollment))
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
    const createdEnrollment = await controller.createEnrollment(req.body)

    res.status(HttpCode.CREATED).json(AppSuccess(HttpCode.CREATED, 'success', 'enrollment created successfully', createdEnrollment))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'enrollment_exist', 'Enrollment already exist'))
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

// update enrollment
export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const enrollmentId: string = req.params?.id
    const updatedEnrollment = await controller.updateEnrollment(enrollmentId, req.body)

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'enrollment updated successfully', updatedEnrollment))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'enrollment_not_exist', 'Enrollment not exist'))
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

// delete enrollment
export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const enrollmentId: string = req.params?.id
    const deletedEnrollment = await controller.deleteEnrollment(enrollmentId)

    if (deletedEnrollment === 0) {
      res.status(HttpCode.FORBIDDEN).json(AppSuccess(HttpCode.FORBIDDEN, 'enrollment_not_exist', 'enrollment not exist'))
      return
    }
    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'enrollment deleted successfully'))

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
