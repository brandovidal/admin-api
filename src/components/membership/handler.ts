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

    const { count, total, memberships } = await controller.getMemberships(startDate, endDate, page, limit)

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'membership list successfully', { memberships, count, total }))
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

    const membership = await controller.getMembership(startDate, endDate)

    if (isEmpty(membership)) {
      res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'membership_not_exist', 'Membership not exist'))
      return
    }

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'find membership successfully', membership))
  } catch (err) {
    res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'membership_not_exist', 'Membership not exist'))
  }
}

// Find memberships
export const getMembershipById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const membershipId: string = req.params?.id
    const membership = await controller.getMembershipById(membershipId)

    if (isEmpty(membership)) {
      res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'membership_not_exist', 'Membership not exist'))
      return
    }

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'membership list successfully', membership))
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
    const createdMembership = await controller.createMembership(req.body)

    res.status(HttpCode.CREATED).json(AppSuccess(HttpCode.CREATED, 'success', 'membership created successfully', createdMembership))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'membership_exist', 'Membership already exist'))
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

// update membership
export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const membershipId: string = req.params?.id
    const updatedMembership = await controller.updateMembership(membershipId, req.body)

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'membership updated successfully', updatedMembership))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'membership_not_exist', 'Membership not exist'))
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

// delete membership
export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const membershipId: string = req.params?.id
    const deletedMembership = await controller.deleteMembership(membershipId)

    if (deletedMembership === 0) {
      res.status(HttpCode.FORBIDDEN).json(AppSuccess(HttpCode.FORBIDDEN, 'membership_not_exist', 'membership not exist'))
      return
    }
    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'membership deleted successfully'))

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
