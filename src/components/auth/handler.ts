import { CookieOptions, NextFunction, Request, Response } from 'express'

import crypto from 'crypto'
import bcrypt from 'bcryptjs'

import { Prisma } from '@prisma/client'

import { LoginUserInput, RegisterUserInput } from '../user/schema'

import {
  createUser,
  findUniqueUser,
  signTokens
} from '../user/repository'

import config from 'config'

// import AppError from '../utils/appError'
// import redisClient from '../utils/connectRedis'

import { CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'

import { signJwt, verifyJwt } from '../../utils/jwt'
import { error } from '../../utils/message'
import { HttpCode } from '../../types/http-code'

const userCache = new CacheContainer(new MemoryStorage())

// ? Cookie Options Here
const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax'
}

if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true

const accessTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + config.get<number>('accessTokenExpiresIn') * 60 * 1000
  ),
  maxAge: config.get<number>('accessTokenExpiresIn') * 60 * 1000
}

const refreshTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + config.get<number>('refreshTokenExpiresIn') * 60 * 1000
  ),
  maxAge: config.get<number>('refreshTokenExpiresIn') * 60 * 1000
}

// ? Register User Controller
export const registerUserHandler = async (
  req: Request<null, null, RegisterUserInput>,
  res: Response,
  next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12)

    const verifyCode = crypto.randomBytes(32).toString('hex')
    const verificationCode = (crypto
      .createHash('sha256')
      .update(verifyCode)
      .digest('hex'))

    const userInput = {
      ...req.body,
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
      verificationCode
    }

    const user = await createUser(userInput)

    res.status(201).json({
      status: 'success',
      data: {
        user
      }
    })
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        return res.status(409).json({
          status: 'fail',
          message: 'Email already exist, please use another email address'
        })
      }
    }
    next(err)
  }
}

// ? Login User Controller
export async function loginUserHandler ({ req, res, next }: { req: Request<null, null, LoginUserInput>, res: Response, next: NextFunction }): Promise<void> {
  try {
    const { email, password } = req.body

    const user = await findUniqueUser(
      { email: email.toLowerCase() },
      { id: true, email: true, verified: true, password: true }
    )

    if (!user || !(await bcrypt.compare(password, user.password))) {
      //   next(new AppError(400, 'Invalid email or password'))
      next(error({ status: HttpCode.BAD_REQUEST, code: 'invalid_email_or_password', message: 'Invalid email or password' }))
      return
    }

    // Sign Tokens
    const { accessToken, refreshToken } = await signTokens(user)
    res.cookie('access_token', accessToken, accessTokenCookieOptions)
    res.cookie('refresh_token', refreshToken, refreshTokenCookieOptions)
    res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false
    })

    res.status(200).json({
      status: 'success',
      accessToken
    })
  } catch (err: any) {
    next(err)
  }
}

// ? Refresh Access Token
export const refreshAccessTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies.refresh_token

    const message = 'Could not refresh access token'

    if (!refreshToken) {
    //   next(new AppError(403, message))
      next(error({ status: HttpCode.FORBIDDEN, code: 'could_not_refresh_access_token', message }))
      return
    }

    // Validate refresh token
    const decoded = verifyJwt<{ sub: string }>(
      refreshToken,
      'refreshTokenPublicKey'
    )

    if (decoded == null) {
    //   next(new AppError(403, message));
      next(error({ status: HttpCode.FORBIDDEN, code: 'could_not_refresh_access_token', message }))
      return
    }

    // Check if user has a valid session
    const session = await userCache.getItem<string>(decoded.sub)
    // const session = await redisClient.get(decoded.sub)

    if (!session) {
      //   next(new AppError(403, message));
      next(error({ status: HttpCode.FORBIDDEN, code: 'could_not_refresh_access_token', message }))
      return
    }

    // Check if user still exist
    const user = await findUniqueUser({ id: JSON.parse(session).id })

    if (!user) {
      //   next(new AppError(403, message));
      next(error({ status: HttpCode.FORBIDDEN, code: 'could_not_refresh_access_token', message }))
      return
    }

    // Sign new access token
    const accessToken = signJwt({ sub: user.id }, 'accessTokenPrivateKey', {
      expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`
    })

    // 4. Add Cookies
    res.cookie('access_token', accessToken, accessTokenCookieOptions)
    res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false
    })

    // 5. Send response
    res.status(200).json({
      status: 'success',
      accessToken
    })
  } catch (err: any) {
    next(err)
  }
}

// ? Logout
function logout (res: Response): void {
  res.cookie('access_token', '', { maxAge: -1 })
  res.cookie('refresh_token', '', { maxAge: -1 })
  res.cookie('logged_in', '', { maxAge: -1 })
}

export const logoutUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await userCache.clear()
    // await redisClient.del(res.locals.user.id)
    logout(res)

    res.status(200).json({
      status: 'success'
    })
  } catch (err: any) {
    next(err)
  }
}
