import { ResponseVO } from './responseVo'

export enum HttpCode {
  OK = 200,
  CREATED = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export class Result {
  private readonly status: number
  private readonly code: string
  private readonly message: string
  private readonly data?: object | null

  constructor (status: number, code: string, message: string, data?: object | null) {
    this.status = status
    this.code = code
    this.message = message
    this.data = data
  }

  /***
   * Serverless: According to the API Gateway specs, the body content must be stringified
  ***/
  bodyToString (): ResponseVO {
    return {
      status: this.status,
      code: this.code,
      message: this.message,
      data: this.data
    }
  }
}

export const success = (status = HttpCode.OK, data: object | null, code = '', message = 'success'): ResponseVO => {
  const result = new Result(status, code, message, data)
  return result.bodyToString()
}

export const error = (status = HttpCode.INTERNAL_SERVER_ERROR, code = '', message = 'error'): ResponseVO => {
  const result = new Result(status, code, message, null)
  return result.bodyToString()
}
