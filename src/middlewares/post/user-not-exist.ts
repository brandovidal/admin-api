import { type NextFunction, type Request, type Response } from 'express'

import { getUserById } from '../../components/user/repository'

import { HttpCode } from '../../types/response'

import { AppError } from '../../utils/appError'

export const userNotExistValidaton = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined> => {
  try {
    const body = req.body

    const userId: string = body.authorId
    const userFinded = await getUserById(userId)

    if (userFinded === null) {
      res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'user_not_exist', 'User not exist'))
      return
    }
    next()
  } catch (err) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(AppError())
  }
}
