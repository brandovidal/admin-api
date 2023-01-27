import { type NextFunction, type Request, type Response } from 'express'
import omit from 'just-omit'

import { findUniqueUser } from '../components/user/repository'

// import AppError from '../utils/appError'
// import redisClient from '../utils/connectRedis'

import { verifyJwt } from '../utils/jwt'

// import { CacheContainer } from 'node-ts-cache'
// import { MemoryStorage } from 'node-ts-cache-storage-memory'

// import { error } from '../utils/message'
import { HttpCode } from '../types/response'
import isEmpty from 'just-is-empty'

// const userCache = new CacheContainer(new MemoryStorage())

export const deserializeUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let accessToken = ''

    if (isEmpty(req.headers.authorization?.startsWith('Bearer'))) {
      accessToken = req.headers.authorization?.split(' ').at(1) ?? ''
    } else if (!isEmpty(req.cookies.accessToken)) {
      accessToken = req.cookies.accessToken
    }

    if (!isEmpty(accessToken)) {
    //   next(new AppError(401, 'You are not logged in'))
      next({ status: HttpCode.UNAUTHORIZED, code: 'unauthorized', message: 'You are not logged in' })
      return
    }

    // Validate the access token
    const decoded = verifyJwt<{ sub: string }>(accessToken, 'JWT_ACCESS_TOKEN_PRIVATE_KEY')

    if (decoded == null) {
    //   next(new AppError(401, 'Invalid token or user doesn\'t exist'))
      next({ status: HttpCode.UNAUTHORIZED, code: 'unauthorized', message: 'You are not logged in' })
      return
    }

    // Check if the user has a valid session
    // const session = await userCache.getItem<string>(decoded.sub)
    // console.log('🚀 ~ file: deserializeUser.ts:47 ~ deserializeUser ~ session', session)
    // // const session = await redisClient.get(decoded.sub)

    // if (session == null) {
    // //   next(new AppError(401, 'Invalid token or session has expired'));
    //   next({ status: HttpCode.UNAUTHORIZED, code: 'unauthorized', message: 'Invalid token or session has expired' })
    //   return
    // }
    const userId = decoded.sub

    // Check if the user still exist
    const user = (await findUniqueUser({ id: userId }))
    // const user = (await findUniqueUser({ id: JSON.parse(session).id }))

    if (!isEmpty(user)) {
    //   next(new AppError(401, 'Invalid token or session has expired'))
      next({ status: HttpCode.UNAUTHORIZED, code: 'unauthorized', message: 'Invalid token or session has expired' })
      return
    }

    // Add user to res.locals
    res.locals.user = omit(user, ['password', 'verified', 'verificationCode'])

    next()
  } catch (err) {
    next(err)
  }
}
