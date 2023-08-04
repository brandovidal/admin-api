import { Prisma } from '@prisma/client'
import type { NextFunction, Request, Response } from 'express'

import isEmpty from 'just-is-empty'

import { HttpCode } from '../../types/response'

import { AppError, AppSuccess, logger } from '../../utils'

import PaymentController from './controller'

const controller = new PaymentController()

// Find payments
export const getPayments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query

    const voucher = query.voucher?.toString()
    const amount = query.amount?.toString()
    const page = parseInt(query.page?.toString() ?? '1')
    const limit = parseInt(query.limit?.toString() ?? '10')

    const { count, total, payments: data } = await controller.getPayments(voucher, amount, page, limit)

    res.status(HttpCode.OK).json(AppSuccess(data, { count, total }))
  } catch (err) {
    res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'payments_not_exist', 'Payments not exist'))
  }
}

// Find only one payment
export const getPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query

    const voucher = query.voucher?.toString() ?? ''
    const amount = query.amount?.toString() ?? ''

    const data = await controller.getPayment(voucher, amount)

    if (isEmpty(data)) {
      res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'payment_not_exist', 'Payment not exist'))
      return
    }

    res.status(HttpCode.OK).json(AppSuccess(data))
  } catch (err) {
    res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'payment_not_exist', 'Payment not exist'))
  }
}

// Find payments
export const getPaymentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const paymentId: string = req.params?.id
    const data = await controller.getPaymentById(paymentId)

    if (isEmpty(data)) {
      res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'payment_not_exist', 'Payment not exist'))
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

// create payment
export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await controller.createPayment(req.body)

    res.status(HttpCode.CREATED).json(AppSuccess(data))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'payment_exist', 'Payment already exist'))
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

// update payment
export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const paymentId: string = req.params?.id
    const data = await controller.updatePayment(paymentId, req.body)

    res.status(HttpCode.OK).json(AppSuccess(data))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        res
          .status(HttpCode.CONFLICT)
          .json(AppError(HttpCode.CONFLICT, 'payment_exist', 'Voucher already exist in other payment'))
        return
      }
      if (err.code === 'P2025') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'payment_not_exist', 'Payment not exist'))
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

// delete payment
export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const paymentId: string = req.params?.id
    await controller.deletePayment(paymentId)

    res.status(HttpCode.OK).json(AppSuccess(null))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2014') {
        res
          .status(HttpCode.CONFLICT)
          .json(AppError(HttpCode.CONFLICT, 'payment_relation_error', 'Payment has relation with other table'))
        return
      }
      if (err.code === 'P2025') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'payment_not_exist', 'Payment not exist'))
        return
      }
    }
    next(err)
  }
}
