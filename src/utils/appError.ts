import { HttpCode, type ErrorType, type ValidationType } from '../types/response'

export default class BaseError extends Error {
  // FIXME: change code to boolean
  readonly status
  // FIXME: it is removed
  readonly code
  // FIXME: this is optional
  readonly message
  // FIXME: this is optional
  readonly validations?

  constructor (status: number, code: string, message: string, validations?: ValidationType[] | null) {
    super(message)

    this.status = status
    this.code = code
    this.message = message
    this.validations = validations

    Error.captureStackTrace(this, this.constructor)
  }

  getValues (): ErrorType {
    return {
      status: this.status,
      code: this.code,
      message: this.message,
      validations: this.validations
    }
  }

  stringify (): string {
    return JSON.stringify(this.getValues())
  }
}

export const AppError = (status = HttpCode.INTERNAL_SERVER_ERROR, code = 'internal_server_error', message = 'Internal server error', validations?: ValidationType[] | null): ErrorType => {
  return new BaseError(status, code, message, validations).getValues()
}

export const AppErrorStringify = (status = HttpCode.INTERNAL_SERVER_ERROR, code = 'internal_server_error', message = 'Internal server error', validations?: ValidationType[] | null): string => {
  return new BaseError(status, code, message, validations).stringify()
}
