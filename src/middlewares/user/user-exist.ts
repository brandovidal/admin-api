import { NextFunction, Request, Response } from 'express'

import { HttpCode } from '../../types/http-code'
import { error } from '../../utils/message'

import { getUserByParams } from '../../components/user/repository'

export const userExistValidaton = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined> => {
  try {
    const body = req.body
    const userFinded = await getUserByParams(body)

    if (userFinded !== null) {
      const result = error({ status: HttpCode.FORBIDDEN, code: 'user_exist', message: 'User already exist' })
      return res.status(HttpCode.FORBIDDEN).json(result)
    }
    next()
  } catch (err) {
    const result = error({ status: HttpCode.INTERNAL_SERVER_ERROR, code: 'internal_server_error', message: 'Internal server error' })
    return res.status(HttpCode.INTERNAL_SERVER_ERROR).json(result)
  }
}
