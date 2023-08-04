import type { ResponseType, ValidationType } from '../types/response'
import { HttpCode } from '../types/response'

export default class BaseError extends Error {
  readonly status
  readonly data: null
  readonly error

  constructor (code: number = HttpCode.INTERNAL_SERVER_ERROR, name = 'internal_server_error', message = 'Internal server error', details?: ValidationType[] | null) {
    super(message)

    const error = {
      code,
      name,
      message,
      details
    }

    this.status = false
    this.data = null
    this.error = error

    Error.captureStackTrace(this, this.constructor)
  }

  getValues (): ResponseType {
    return {
      status: this.status,
      data: this.data,
      error: this.error
    }
  }

  stringify (): string {
    return JSON.stringify(this.getValues())
  }
}

export const AppError = (status = HttpCode.INTERNAL_SERVER_ERROR, code = 'internal_server_error', message = 'Internal server error', details?: ValidationType[] | null): ResponseType => {
  return new BaseError(status, code, message, details).getValues()
}

export const AppErrorStringify = (status = HttpCode.INTERNAL_SERVER_ERROR, code = 'internal_server_error', message = 'Internal server error', details?: ValidationType[] | null): string => {
  return new BaseError(status, code, message, details).stringify()
}
