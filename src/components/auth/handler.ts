import type { NextFunction, Request, Response } from 'express'

import { Prisma, User } from '@prisma/client'

import { CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'

import isEmpty from 'just-is-empty'

import type { LoginUserInput } from './schema'

import { getUniqueUser } from '../user/repository'
import { signTokens } from './repository'

import { HttpCode } from '../../types/response'

import { AppError, AppSuccess, signJwt, verifyJwt } from '../../utils'

import AuthController from './controller'

import { refreshTokenMessage } from '../../constants/cookie'

const controller = new AuthController()

const userCache = new CacheContainer(new MemoryStorage())

// ? Register User Controller
export const register = async (req: Request<object, object, User>, res: Response, next: NextFunction): Promise<Response<object, Record<string, object>> | undefined> => {
  try {
    const body = req.body

    const user = await controller.register(body)

    res.status(HttpCode.CREATED).json(AppSuccess(HttpCode.CREATED, 'user_register', 'user registered', { user }))
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        res.status(HttpCode.CONFLICT).json(AppError(HttpCode.CONFLICT, 'user_exist', 'User already exist'))
        return
      }
    }
    next(err)
  }
}

// ? Login User Controller
export const login = async (req: Request<object, object, LoginUserInput>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const body = req.body

    const { isLogged, user } = await controller.login(body)
    if (!isLogged) {
      next(AppError(HttpCode.BAD_REQUEST, 'invalid_email_or_password', 'Invalid email or password'))
      return
    }

    // Sign Tokens
    const { accessToken, refreshToken } = await signTokens(user)

    res.header('Authorization', `Bearer ${accessToken}`)
    res.header('refreshToken', refreshToken)
    res.header('loggedIn', 'true')

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'login_success', 'Login success', { accessToken }))
  } catch (err) {
    next(err)
  }
}

// ? Refresh Access Token
export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const refreshToken = req.headers.refreshToken as string
    if (!isEmpty(refreshToken)) {
      next(AppError(HttpCode.FORBIDDEN, 'could_not_refresh_access_token', refreshTokenMessage))
      return
    }

    // Validate refresh token
    const decoded = verifyJwt<{ sub: string }>(refreshToken, 'JWT_REFRESH_TOKEN_PRIVATE_KEY')
    if (decoded == null) {
      next(AppError(HttpCode.FORBIDDEN, 'could_not_refresh_access_token', refreshTokenMessage))
      return
    }

    // Check if user has a valid session
    const session = await userCache.getItem<string>(decoded.sub) as string
    if (!isEmpty(session)) {
      next(AppError(HttpCode.FORBIDDEN, 'could_not_refresh_access_token', refreshTokenMessage))
      return
    }

    // Check if user still exist
    const user = await getUniqueUser({ id: JSON.parse(session).id })
    if (!isEmpty(user)) {
      next(AppError(HttpCode.FORBIDDEN, 'could_not_refresh_access_token', refreshTokenMessage))
      return
    }

    // Sign new access token
    const accessToken = signJwt({ sub: user.id }, 'JWT_ACCESS_TOKEN_PRIVATE_KEY', { expiresIn: `${15}m` })

    // 4. Add Cookies
    res.header('Authorization', `Bearer ${accessToken}`)
    res.header('loggedIn', 'true')

    // 5. Send response
    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'refresh_access_success', 'Refresh access success', { accessToken }))
  } catch (err) {
    next(err)
  }
}

// ? Logout
export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await userCache.clear()

    res.removeHeader('Authorization')
    res.removeHeader('loggedIn')

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'logout_success', 'Logout success'))
  } catch (err) {
    next(err)
  }
}
