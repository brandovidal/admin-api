import { type User } from '@prisma/client'
import type { MetaResponse } from './utils/response'

export interface UsersResponse {
  meta?: MetaResponse
  data: User[]
}

export interface UserLoggedResponse {
  user: User
  isLogged: boolean
}

export interface UserToken {
  accessToken: string
  refreshToken: string
}
