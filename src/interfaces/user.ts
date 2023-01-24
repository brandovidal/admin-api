import { User } from '@prisma/client'

export interface UserWhereParams extends User {
  page?: number
  size?: number
}

export interface UsersResponse { count?: number, total?: number, users: User[] }
export interface UserResponse { user: User | null }

export interface InternalErrorJSON {
  status: 500
  code: 'internal_server_error'
  message: 'Internal server error'
  error: null
}
export interface ValidateErrorJSON {
  status: 400
  code: 'validation_error'
  message: 'User validation with erros'
  error: Array<{ path: string, message: string }>
}

export interface ForbiddenErrorJSON {
  status: 403
  code: 'internal_server_error'
  message: 'Internal server error'
  error: null
}
