import { Prisma } from '@prisma/client'
import type { NextFunction, Request, Response } from 'express'

import isEmpty from 'just-is-empty'

import { HttpCode } from '../../types/response'

import { AppError, AppSuccess, logger } from '../../utils'

import MembershipController from './controller'

const controller = new MembershipController()

// Find memberships
export const getMemberships = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query

    const startDate = query.startDate?.toString()
    const endDate = query.endDate?.toString()
    const page = parseInt(query.page?.toString() ?? '1')
    const limit = parseInt(query.limit?.toString() ?? '10')

    const { data, meta } = await controller.getMemberships(startDate, endDate, page, limit)

    res.status(HttpCode.OK).json(AppSuccess(data, meta))
  } catch (err) {
    res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'memberships_not_exist', 'Memberships not exist'))
  }
}

// Find only one membership
export const getMembership = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query

    const startDate = query.startDate?.toString() ?? ''
    const endDate = query.endDate?.toString() ?? ''

    const data = await controller.getMembership(startDate, endDate)

    if (isEmpty(data)) {
      res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'membership_not_exist', 'Membership not exist'))
      return
    }

    res.status(HttpCode.OK).json(AppSuccess(data))
  } catch (err) {
    res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'membership_not_exist', 'Membership not exist'))
  }
}

// Find memberships
export const getMembershipById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const membershipId: string = req.params?.id
    const data = await controller.getMembershipById(membershipId)

    if (isEmpty(data)) {
      res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'membership_not_exist', 'Membership not exist'))
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

// create membership
export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await controller.createMembership(req.body)

    res.status(HttpCode.CREATED).json(AppSuccess(data))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'membership_exist', 'Membership already exist'))
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

// update membership
export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const membershipId: string = req.params?.id
    const data = await controller.updateMembership(membershipId, req.body)

    res.status(HttpCode.OK).json(AppSuccess(data))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'membership_not_exist', 'Membership not exist'))
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

// delete membership
export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const membershipId: string = req.params?.id
    await controller.deleteMembership(membershipId)

    res.status(HttpCode.OK).json(AppSuccess(null))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2014') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'membership_relation_error', 'Membership has relation with other table'))
        return
      }
      if (err.code === 'P2025') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'membership_not_exist', 'Membership not exist'))
        return
      }
    }
    next(err)
  }
}
