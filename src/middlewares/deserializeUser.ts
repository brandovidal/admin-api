import { NextFunction, Request, Response } from 'express'
import omit from 'just-omit'

import { findUniqueUser } from '../components/user/repository'

// import AppError from '../utils/appError'
// import redisClient from '../utils/connectRedis'

import { verifyJwt } from '../utils/jwt'

import { CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'

import { error } from '../utils/message'
import { HttpCode } from '../types/http-code'

const userCache = new CacheContainer(new MemoryStorage())

export const deserializeUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let accessToken: string | undefined

    if ((req.headers.authorization?.startsWith('Bearer')) ?? false) {
      accessToken = req.headers.authorization?.split(' ')[1]
    } else if (req.cookies.accessToken) {
      accessToken = req.cookies.accessToken
    }

    if (!accessToken) {
    //   next(new AppError(401, 'You are not logged in'))
      next(error({ status: HttpCode.UNAUTHORIZED, code: 'unauthorized', message: 'You are not logged in' }))
      return
    }

    // Validate the access token
    const decoded = verifyJwt<{ sub: string }>(
      accessToken,
      'accessTokenPublicKey'
    )

    if (decoded == null) {
    //   next(new AppError(401, 'Invalid token or user doesn\'t exist'))
      next(error({ status: HttpCode.UNAUTHORIZED, code: 'unauthorized', message: 'You are not logged in' }))
      return
    }

    // Check if the user has a valid session
    const session = await userCache.getItem<string>(decoded.sub)
    // const session = await redisClient.get(decoded.sub)

    if (session == null) {
    //   next(new AppError(401, 'Invalid token or session has expired'));
      next(error({ status: HttpCode.UNAUTHORIZED, code: 'unauthorized', message: 'Invalid token or session has expired' }))
      return
    }

    // Check if the user still exist
    const user = (await findUniqueUser({ id: JSON.parse(session).id }))

    if (!user) {
    //   next(new AppError(401, 'Invalid token or session has expired'))
      next(error({ status: HttpCode.UNAUTHORIZED, code: 'unauthorized', message: 'Invalid token or session has expired' }))
      return
    }

    // Add user to res.locals
    res.locals.user = omit(user, ['password', 'verified', 'verificationCode'])

    next()
  } catch (err: any) {
    next(err)
  }
}
