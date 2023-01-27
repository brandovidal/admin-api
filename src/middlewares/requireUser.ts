import { type NextFunction, type Request, type Response } from 'express'

import { error } from '../utils/message'
import { HttpCode } from '../types/response'
import isEmpty from 'just-is-empty'

// import AppError from '../utils/appError'

export const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const user = res.locals.user

    if (!isEmpty(user)) {
    //   next(new AppError(401, 'Session has expired or user doesn\'t exist'))
      next(error({ status: HttpCode.UNAUTHORIZED, code: 'session_expired', message: 'Session has expired or user doesn\'t exist' }))
      return
    }

    next()
  } catch (err) {
    next(err)
  }
}
