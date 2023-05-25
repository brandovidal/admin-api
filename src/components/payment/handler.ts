import { Prisma } from '@prisma/client'
import type { NextFunction, Request, Response } from 'express'

import isEmpty from 'just-is-empty'

import { HttpCode } from '../../types/response'

import { AppError, AppSuccess, AppSuccessByList, logger } from '../../utils'

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

    const { count, total, payments } = await controller.getPayments(voucher, amount, page, limit)

    res.status(HttpCode.OK).json(AppSuccessByList(HttpCode.OK, 'success', 'payment list successfully', payments, count, total))
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

    const payment = await controller.getPayment(voucher, amount)

    if (isEmpty(payment)) {
      res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'payment_not_exist', 'Payment not exist'))
      return
    }

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'find payment successfully', payment))
  } catch (err) {
    res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'payment_not_exist', 'Payment not exist'))
  }
}

// Find payments
export const getPaymentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const paymentId: string = req.params?.id
    const payment = await controller.getPaymentById(paymentId)

    if (isEmpty(payment)) {
      res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'payment_not_exist', 'Payment not exist'))
      return
    }

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'payment list successfully', payment))
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
    const createdPayment = await controller.createPayment(req.body)

    res.status(HttpCode.CREATED).json(AppSuccess(HttpCode.CREATED, 'success', 'payment created successfully', createdPayment))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'payment_exist', 'Payment already exist'))
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

// update payment
export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const paymentId: string = req.params?.id
    const updatedPayment = await controller.updatePayment(paymentId, req.body)

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'payment updated successfully', updatedPayment))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'payment_exist', 'Voucher already exist in other payment'))
        return
      }
      if (err.code === 'P2025') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'payment_not_exist', 'Payment not exist'))
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

// delete payment
export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const paymentId: string = req.params?.id
    const deletedPayment = await controller.deletePayment(paymentId)

    if (deletedPayment === 0) {
      res.status(HttpCode.FORBIDDEN).json(AppSuccess(HttpCode.FORBIDDEN, 'payment_not_exist', 'payment not exist'))
      return
    }
    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'payment deleted successfully'))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2014') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'payment_relation_error', 'Payment has relation with other table'))
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
