import { CookieOptions } from 'express'

const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax'
}

if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true
