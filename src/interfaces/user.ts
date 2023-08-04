import { type User } from '@prisma/client'

export interface MetaResponse {
  pagination?: {
    page: number
    pageSize: number
    pageCount: number
    total: number
  }
}

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
