import { HttpCode } from '../types/response'

export interface InternalErrorJSON {
  status: HttpCode.INTERNAL_SERVER_ERROR
  code: 'internal_server_error'
  message: 'Internal server error'
  error: string | null
}
export interface ValidateErrorJSON {
  status: HttpCode.BAD_REQUEST
  code: 'validation_error'
  message: 'User validation with erros'
  error: Array<{ path: string, message: string }>
}

export interface ForbiddenErrorJSON {
  status: HttpCode.FORBIDDEN
  code: 'internal_server_error'
  message: 'Internal server error'
  error: string | null
}
