import { NextFunction, Request, Response } from 'express'

import { getUserById } from '../../components/user/repository'

import { HttpCode } from '../../types/response'

import { AppError } from '../../utils/appError'

export const userNotExistValidaton = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined> => {
  try {
    const userId: string = req.params.id
    const userFinded = await getUserById(userId)

    if (userFinded === null) {
      const result = AppError(HttpCode.FORBIDDEN, 'user_not_exist', 'User not exist')
      return res.status(HttpCode.FORBIDDEN).json(result)
    }
    next()
  } catch (err) {
    const result = AppError()
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(result)
  }
}
