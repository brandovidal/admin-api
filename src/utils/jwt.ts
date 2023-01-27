import jwt, { type SignOptions } from 'jsonwebtoken'
// import config from 'config'

import dotenv from 'dotenv'

dotenv.config()

// ? Sign Access or Refresh Token
export const signJwt = (
  payload: object,
  keyName: 'JWT_ACCESS_TOKEN_PRIVATE_KEY' | 'JWT_REFRESH_TOKEN_PRIVATE_KEY',
  options: SignOptions
): string => {
  // const keyValue = config.get<string>(keyName)
  const keyValue = process.env[keyName] ?? 'private_key'
  const privateKey = Buffer.from(keyValue, 'base64').toString('ascii')

  return jwt.sign(payload, privateKey, { ...options, algorithm: 'HS256' })
}

// ? Verify Access or Refresh Token

// ? Verify Access or Refresh Token
export const verifyJwt = <T>(
  token: string,
  keyName: 'JWT_ACCESS_TOKEN_PRIVATE_KEY' | 'JWT_REFRESH_TOKEN_PRIVATE_KEY'
): T | null => {
  try {
    const keyValue = process.env[keyName] ?? 'private_key'
    const publicKey = Buffer.from(
      keyValue,
      'base64'
    ).toString('ascii')
    const decoded = jwt.verify(token, publicKey) as T

    return decoded
  } catch (error) {
    return null
  }
}
