import { type User } from '@prisma/client'

export interface UserWhereParams extends User {
  page?: number
  size?: number
}

export interface UsersResponse {
  count?: number
  total?: number
  users: User[]
}
export interface UserResponse {
  user: User | null
}

export interface UserLoggedResponse {
  user: User
  isLogged: boolean
}

export interface UserToken {
  accessToken: string
  refreshToken: string
}
