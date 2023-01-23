import { NextFunction, Request, Response } from 'express'

import { Prisma } from '@prisma/client'

import { HttpCode } from '../../../types/http-code'
import { error } from '../../../utils/message'

import { findUserById } from './../service'

export const userNotExistValidaton = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined> => {
  try {
    const params: Prisma.UserWhereUniqueInput = req.params
    const userFinded = await findUserById(params)

    if (userFinded === null) {
      const result = error({ status: HttpCode.FORBIDDEN, code: 'user_not_exist', message: 'User not exist' })
      return res.status(HttpCode.FORBIDDEN).json(result)
    }
    next()
  } catch (err) {
    const result = error({ status: HttpCode.INTERNAL_SERVER_ERROR, code: 'internal_server_error', message: 'Internal server error' })
    return res.status(HttpCode.INTERNAL_SERVER_ERROR).json(result)
  }
}
