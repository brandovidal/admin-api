import { type User } from '@prisma/client'
import type { MetaType } from '../types/response'

export interface UsersResponse {
  meta?: MetaType | object | null
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
