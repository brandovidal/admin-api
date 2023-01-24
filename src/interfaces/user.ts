import { User } from '@prisma/client'

export interface UserWhereParams extends User {
  page?: number
  size?: number
}

export interface UserResponse { count: number, users: User[] }
