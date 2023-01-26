import { NextFunction, Request, Response } from 'express'

import { error } from '../utils/message'
import { HttpCode } from '../types/http-code'

// import AppError from '../utils/appError'

export const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const user = res.locals.user
    console.log('🚀 ~ file: requireUser.ts:15 ~ user', user)

    if (!user) {
    //   next(new AppError(401, 'Session has expired or user doesn\'t exist'))
      next(error({ status: HttpCode.UNAUTHORIZED, code: 'session_expired', message: 'Session has expired or user doesn\'t exist' }))
      return
    }

    next()
  } catch (err: any) {
    next(err)
  }
}
