import { Prisma } from '@prisma/client'
import type { NextFunction, Request, Response } from 'express'

import isEmpty from 'just-is-empty'

import { HttpCode } from '../../types/response'

import { AppError, AppSuccess, logger } from '../../utils'

import CountryController from './controller'

const controller = new CountryController()

// Find countries
export const getCountries = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query

    const name = query.name?.toString()
    const iso3 = query.iso3?.toString()
    const page = parseInt(query.page?.toString() ?? '1')
    const limit = parseInt(query.limit?.toString() ?? '10')

    const { count, total, countries: data } = await controller.getCountries(name, iso3, page, limit)

    res.status(HttpCode.OK).json(AppSuccess(data, { count, total }))
  } catch (err) {
    res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'courses_not_exist', 'Countries not exist'))
  }
}

// Find only one country
export const getCountry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query

    const name = query.name?.toString() ?? ''
    const iso3 = query.iso3?.toString() ?? ''

    const data = await controller.getCountry(name, iso3)

    if (isEmpty(data)) {
      res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'course_not_exist', 'Country not exist'))
      return
    }

    res.status(HttpCode.OK).json(AppSuccess(data))
  } catch (err) {
    res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'course_not_exist', 'Country not exist'))
  }
}

// Find countries
export const getCountryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const courseId: string = req.params?.id
    const data = await controller.getCountryById(courseId)

    if (isEmpty(data)) {
      res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'course_not_exist', 'Country not exist'))
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

// create country
export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await controller.createCountry(req.body)

    res.status(HttpCode.CREATED).json(AppSuccess(data))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'course_exist', 'Country already exist'))
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

// update country
export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const courseId: string = req.params?.id
    const data = await controller.updateCountry(courseId, req.body)

    res.status(HttpCode.OK).json(AppSuccess(data))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'course_not_exist', 'Country not exist'))
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

// delete country
export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const courseId: string = req.params?.id
    await controller.deleteCountry(courseId)

    res.status(HttpCode.OK).json(AppSuccess(null))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2014') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'course_relation_error', 'Country has relation with other table'))
        return
      }
      if (err.code === 'P2025') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'course_not_exist', 'Country not exist'))
        return
      }
    }
    next(err)
  }
}
