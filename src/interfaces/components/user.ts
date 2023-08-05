import { type User } from '@prisma/client'

export interface UserLoggedResponse {
  user: User
  isLogged: boolean
}

export interface UserToken {
  accessToken: string
  refreshToken: string
}
