import { type User } from '@prisma/client'

export interface UsersResponse {
  count?: number
  total?: number
  users: User[]
}

export interface UserLoggedResponse {
  user: User
  isLogged: boolean
}

export interface UserToken {
  accessToken: string
  refreshToken: string
}
