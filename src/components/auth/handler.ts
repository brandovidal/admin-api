import { type CookieOptions, type NextFunction, type Request, type Response } from 'express'

import crypto from 'crypto'
import bcrypt from 'bcryptjs'

import { Prisma } from '@prisma/client'

import { CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'

import isEmpty from 'just-is-empty'

import { type LoginUserInput, type RegisterUserInput } from './schema'

import { createUser, findUniqueUser, signTokens } from '../user/repository'

import { HttpCode } from '../../types/response'

import { accessTokenExpiresIn, refreshTokenExpiresIn } from '../../constants/repository'

import { AppError, AppSuccess, signJwt, verifyJwt } from '../../utils'

import AuthController from './controller'

const controller = new AuthController()

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
export const registerUserHandler = async (req: Request<object, object, RegisterUserInput>, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined> => {
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

    const user = await createUser(userInput)

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
export const loginUserHandler = async (req: Request<object, object, LoginUserInput>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body

    const user = await controller.findUser(email)

    if (!isEmpty(user) || !(await bcrypt.compare(password, user.password))) {
      next(AppError(HttpCode.BAD_REQUEST, 'invalid_email_or_password', 'Invalid email or password'))
      return
    }

    // Sign Tokens
    const { accessToken, refreshToken } = await signTokens(user)

    res.header('Authorization', `Bearer ${accessToken}`)
    res.cookie('access_token', accessToken, accessTokenCookieOptions)
    res.cookie('refresh_token', refreshToken, refreshTokenCookieOptions)
    res.cookie('logged_in', true, { ...accessTokenCookieOptions, httpOnly: false })

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'login_success', 'Login success', { accessToken }))
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
    const message = 'Could not refresh access token'

    const refreshToken = req.cookies.refresh_token
    if (!isEmpty(refreshToken)) {
      next(AppError(HttpCode.FORBIDDEN, 'could_not_refresh_access_token', message))
      return
    }

    // Validate refresh token
    const decoded = verifyJwt<{ sub: string }>(refreshToken, 'JWT_REFRESH_TOKEN_PRIVATE_KEY')
    if (decoded == null) {
      next(AppError(HttpCode.FORBIDDEN, 'could_not_refresh_access_token', message))
      return
    }

    // Check if user has a valid session
    const session = await userCache.getItem<string>(decoded.sub) ?? ''
    if (!isEmpty(session)) {
      next(AppError(HttpCode.FORBIDDEN, 'could_not_refresh_access_token', message))
      return
    }

    // Check if user still exist
    const user = await findUniqueUser({ id: JSON.parse(session).id })
    if (!isEmpty(user)) {
      next(AppError(HttpCode.FORBIDDEN, 'could_not_refresh_access_token', message))
      return
    }

    // Sign new access token
    const accessToken = signJwt({ sub: user.id }, 'JWT_ACCESS_TOKEN_PRIVATE_KEY', { expiresIn: `${15}m` })

    // 4. Add Cookies
    res.header('Authorization', `Bearer ${accessToken}`)
    res.cookie('access_token', accessToken, accessTokenCookieOptions)
    res.cookie('logged_in', true, { ...accessTokenCookieOptions, httpOnly: false })

    // 5. Send response
    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'refresh_access_success', 'Refresh access success', { accessToken }))
  } catch (err) {
    next(err)
  }
}

// ? Logout
const logout = (res: Response): void => {
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
    logout(res)

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'logout_success', 'Logout success'))
  } catch (err) {
    next(err)
  }
}
