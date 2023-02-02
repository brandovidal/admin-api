import type { NextFunction, Request, Response } from 'express'

import isEmpty from 'just-is-empty'

import { HttpCode } from '../types/response'
import { AppError } from '../utils'

export const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const user = res.locals.user

    if (!isEmpty(user)) {
      next(AppError(HttpCode.UNAUTHORIZED, 'session_expired', 'Session has expired or user doesn\'t exist'))
      return
    }

    next()
  } catch (err) {
    next(err)
  }
}
