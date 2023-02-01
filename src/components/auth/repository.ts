import type { Prisma, User } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

import { signJwt } from '../../utils'

import { UserToken } from '../../interfaces/user'

import { accessTokenExpiresIn, redisCacheExpiresIn, refreshTokenExpiresIn } from '../../constants/repository'

import { findUniqueUser } from '../user/repository'

import { CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'

import omit from 'just-omit'

const userCache = new CacheContainer(new MemoryStorage())
const prisma = new PrismaClient()

export const signTokens = async (user: Prisma.UserCreateInput): Promise<UserToken> => {
  const userId = user.id as string

  await userCache.setItem(`${userId}`, JSON.stringify(omit(user, ['password', 'verified', 'verificationCode'])), { ttl: redisCacheExpiresIn * 60 })

  const accessToken = signJwt({ sub: user.id }, 'JWT_ACCESS_TOKEN_PRIVATE_KEY', { expiresIn: `${accessTokenExpiresIn}m` })
  const refreshToken = signJwt({ sub: user.id }, 'JWT_REFRESH_TOKEN_PRIVATE_KEY', { expiresIn: `${refreshTokenExpiresIn}m` })

  return { accessToken, refreshToken }
}

export const login = async (email: string): Promise<User> => {
  const user = await findUniqueUser(
    { email: email.toLowerCase() },
    { id: true, email: true, verified: true, password: true }
  )
  void prisma.$disconnect()
  return user
}
