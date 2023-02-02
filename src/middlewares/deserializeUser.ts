import { type NextFunction, type Request, type Response } from 'express'
import omit from 'just-omit'

import { getUniqueUser } from '../components/user/repository'

import { HttpCode } from '../types/response'

import isEmpty from 'just-is-empty'

import { AppError, verifyJwt } from '../utils'

import { CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'

const userCache = new CacheContainer(new MemoryStorage())

export const deserializeUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let accessToken = ''
    if (isEmpty(req.headers.authorization?.startsWith('Bearer'))) {
      accessToken = req.headers.authorization?.split(' ').at(1) ?? ''
    } else if (!isEmpty(req.cookies.accessToken)) {
      accessToken = req.cookies.accessToken
    }

    if (!isEmpty(accessToken)) {
      next(AppError(HttpCode.UNAUTHORIZED, 'unauthorized', 'You are not logged in'))
      return
    }

    // Validate the access token
    const decoded = verifyJwt<{ sub: string }>(accessToken, 'JWT_ACCESS_TOKEN_PRIVATE_KEY')
    if (decoded == null) {
      next(AppError(HttpCode.UNAUTHORIZED, 'unauthorized', 'You are not logged in'))
      return
    }

    // Check if the user has a valid session
    const session = await userCache.getItem<string>(decoded.sub)
    if (session == null) {
      next(AppError(HttpCode.UNAUTHORIZED, 'unauthorized', 'Invalid token or session has expired'))
      return
    }
    const userId = decoded.sub

    // Check if the user still exist
    const user = (await getUniqueUser({ id: userId }))

    if (!isEmpty(user)) {
      next(AppError(HttpCode.UNAUTHORIZED, 'unauthorized', 'Invalid token or session has expired'))
      return
    }

    // Add user to res.locals
    res.locals.user = omit(user, ['password', 'verified', 'verificationCode'])

    next()
  } catch (err) {
    next(err)
  }
}
