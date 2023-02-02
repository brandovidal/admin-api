import { CookieOptions } from 'express'

import { accessTokenExpiresIn, refreshTokenExpiresIn } from './repository'

// ? Cookie Options Here
const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax'
}

if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true

export const accessTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + accessTokenExpiresIn * 60 * 1000
  ),
  maxAge: accessTokenExpiresIn * 60 * 1000
}

export const refreshTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + refreshTokenExpiresIn * 60 * 1000
  ),
  maxAge: refreshTokenExpiresIn * 60 * 1000
}

export const refreshTokenMessage = 'Could not refresh access token'