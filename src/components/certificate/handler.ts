import { Prisma } from '@prisma/client'
import type { NextFunction, Request, Response } from 'express'

import isEmpty from 'just-is-empty'

import { HttpCode } from '../../types/response'

import { AppError, AppSuccess, logger } from '../../utils'

import CertificateController from './controller'

const controller = new CertificateController()

// Find certificates
export const getCertificates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query

    const dateOfIssue = query.dateOfIssue?.toString()
    const url = query.url?.toString()
    const page = parseInt(query.page?.toString() ?? '1')
    const size = parseInt(query.size?.toString() ?? '10')

    const { count, total, certificates } = await controller.getCertificates(dateOfIssue, url, page, size)

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'certificate list successfully', { certificates, count, total }))
  } catch (err) {
    res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'certificates_not_exist', 'Certificates not exist'))
  }
}

// Find only one certificate
export const getCertificate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query

    const dateOfIssue = query.dateOfIssue?.toString() ?? ''
    const url = query.url?.toString() ?? ''

    const certificate = await controller.getCertificate(dateOfIssue, url)

    if (isEmpty(certificate)) {
      res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'certificate_not_exist', 'Certificate not exist'))
      return
    }

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'find certificate successfully', certificate))
  } catch (err) {
    res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'certificate_not_exist', 'Certificate not exist'))
  }
}

// Find certificates
export const getCertificateById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const certificateId: string = req.params?.id
    const certificate = await controller.getCertificateById(certificateId)

    if (isEmpty(certificate)) {
      res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'certificate_not_exist', 'Certificate not exist'))
      return
    }

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'certificate list successfully', certificate))
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

// create certificate
export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const createdCertificate = await controller.createCertificate(req.body)

    res.status(HttpCode.CREATED).json(AppSuccess(HttpCode.CREATED, 'success', 'certificate created successfully', createdCertificate))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'certificate_exist', 'Certificate already exist'))
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

// update certificate
export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const certificateId: string = req.params?.id
    const updatedCertificate = await controller.updateCertificate(certificateId, req.body)

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'certificate updated successfully', updatedCertificate))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'certificate_not_exist', 'Certificate not exist'))
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

// delete certificate
export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const certificateId: string = req.params?.id
    const deletedCertificate = await controller.deleteCertificate(certificateId)

    if (deletedCertificate === 0) {
      res.status(HttpCode.FORBIDDEN).json(AppSuccess(HttpCode.FORBIDDEN, 'certificate_not_exist', 'certificate not exist'))
      return
    }
    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'certificate deleted successfully'))

  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2014') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'certificate_relation_error', 'Certificate has relation with other table'))
        return
      }
      if (err.code === 'P2025') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'certificate_not_exist', 'Certificate not exist'))
        return
      }
    }
    next(err)
  }
}
