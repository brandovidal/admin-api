import { type CookieOptions, type NextFunction, type Request, type Response } from 'express'

import crypto from 'crypto'
import bcrypt from 'bcryptjs'

import { Prisma } from '@prisma/client'

import { CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'

import { type LoginUserInput, type RegisterUserInput } from './schema'

import {
  createUser,
  findUniqueUser,
  signTokens
} from '../user/repository'

// import config from 'config'

// import AppError from '../utils/appError'
// import redisClient from '../utils/connectRedis'

import { signJwt, verifyJwt } from '../../utils/jwt'
import { error } from '../../utils/message'
import { HttpCode } from '../../types/response'

import { accessTokenExpiresIn, refreshTokenExpiresIn } from '../../constants/repository'
import isEmpty from 'just-is-empty'

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
    Date.now() + accessTokenExpiresIn * 60 * 1000
  ),
  maxAge: accessTokenExpiresIn * 60 * 1000
}

const refreshTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + refreshTokenExpiresIn * 60 * 1000
  ),
  maxAge: refreshTokenExpiresIn * 60 * 1000
}

// ? Register User Controller
export const registerUserHandler = async (req: Request<object, object, RegisterUserInput>, res: Response, next: NextFunction): Promise<Response<object, Record<string, object>> | undefined> => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12)

    const verifyCode = crypto.randomBytes(32).toString('hex')
    const verificationCode = (crypto
      .createHash('sha256')
      .update(verifyCode)
      .digest('hex'))

    const userInput = {
      username: req.body.username,
      name: req.body.name,
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
      verificationCode
    }
    // delete userInput.passwordConfirm

    const user = await createUser(userInput)

    res.status(201).json({
      status: 'success',
      data: {
        user
      }
    })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        // return error({ status: HttpCode.CONFLICT, code: 'invalid_email_or_password', message: 'Invalid email or password' })
        return res.status(HttpCode.CONFLICT).json({ status: HttpCode.CONFLICT, code: 'user_exist', message: 'User already exist' })
      }
    }
    next(err)
  }
}

// ? Login User Controller
export const loginUserHandler = async (req: Request<object, object, LoginUserInput>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body

    const user = await findUniqueUser(
      { email: email.toLowerCase() },
      { id: true, email: true, verified: true, password: true }
    )

    if (!isEmpty(user) || !(await bcrypt.compare(password, user.password))) {
      //   next(new AppError(400, 'Invalid email or password'))
      next(error({ status: HttpCode.BAD_REQUEST, code: 'invalid_email_or_password', message: 'Invalid email or password' }))
      return
    }

    // Sign Tokens
    const { accessToken, refreshToken } = await signTokens(user)

    res.header('Authorization', `Bearer ${accessToken}`)
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
  } catch (err) {
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

    if (!isEmpty(refreshToken)) {
    //   next(new AppError(403, message))
      next(error({ status: HttpCode.FORBIDDEN, code: 'could_not_refresh_access_token', message }))
      return
    }

    // Validate refresh token
    const decoded = verifyJwt<{ sub: string }>(
      refreshToken,
      'JWT_REFRESH_TOKEN_PRIVATE_KEY'
    )

    if (decoded == null) {
    //   next(new AppError(403, message));
      next(error({ status: HttpCode.FORBIDDEN, code: 'could_not_refresh_access_token', message }))
      return
    }

    // Check if user has a valid session
    const session = await userCache.getItem<string>(decoded.sub) ?? ''
    // const session = await redisClient.get(decoded.sub)

    if (!isEmpty(session)) {
      //   next(new AppError(403, message));
      next(error({ status: HttpCode.FORBIDDEN, code: 'could_not_refresh_access_token', message }))
      return
    }

    // Check if user still exist
    const user = await findUniqueUser({ id: JSON.parse(session).id })

    if (!isEmpty(user)) {
      //   next(new AppError(403, message));
      next(error({ status: HttpCode.FORBIDDEN, code: 'could_not_refresh_access_token', message }))
      return
    }

    // Sign new access token
    const accessToken = signJwt({ sub: user.id }, 'JWT_ACCESS_TOKEN_PRIVATE_KEY', {
      expiresIn: `${15}m`
    })

    // 4. Add Cookies
    res.header('Authorization', `Bearer ${accessToken}`)
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
  } catch (err) {
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
  } catch (err) {
    next(err)
  }
}
