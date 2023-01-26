import { NextFunction, Request, Response } from 'express'

import { getUser } from '../../components/user/repository'

import { HttpCode } from '../../types/response'

import { AppError } from '../../utils/appError'

export const userExistValidaton = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined> => {
  try {
    const body = req.body

    const name = body.name?.toString() ?? ''
    const email = body.email?.toString() ?? ''

    const { user } = await getUser(name, email)

    if (user !== null) {
      const result = AppError(HttpCode.FORBIDDEN, 'user_exist', 'User already exist')
      return res.status(HttpCode.FORBIDDEN).json(result)
    }
    next()
  } catch (err) {
    const result = AppError()
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(result)
  }
}
