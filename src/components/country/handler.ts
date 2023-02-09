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
    const size = parseInt(query.size?.toString() ?? '10')

    const { count, total, countries } = await controller.getCountries(name, iso3, page, size)

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'country list successfully', { countries, count, total }))
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

    const country = await controller.getCountry(name, iso3)

    if (isEmpty(country)) {
      res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'course_not_exist', 'Country not exist'))
      return
    }

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'find country successfully', country))
  } catch (err) {
    res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'course_not_exist', 'Country not exist'))
  }
}

// Find countries
export const getCountryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const courseId: string = req.params?.id
    const country = await controller.getCountryById(courseId)

    if (isEmpty(country)) {
      res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'course_not_exist', 'Country not exist'))
      return
    }

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'country list successfully', country))
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
    const createdCountry = await controller.createCountry(req.body)

    res.status(HttpCode.CREATED).json(AppSuccess(HttpCode.CREATED, 'success', 'country created successfully', createdCountry))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'course_exist', 'Country already exist'))
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

// update country
export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const courseId: string = req.params?.id
    const updatedCountry = await controller.updateCountry(courseId, req.body)

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'country updated successfully', updatedCountry))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'course_not_exist', 'Country not exist'))
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

// delete country
export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const courseId: string = req.params?.id
    const deletedCountry = await controller.deleteCountry(courseId)

    if (deletedCountry === 0) {
      res.status(HttpCode.FORBIDDEN).json(AppSuccess(HttpCode.FORBIDDEN, 'course_not_exist', 'country not exist'))
      return
    }
    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'country deleted successfully'))

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
