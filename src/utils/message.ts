import { ResponseVO } from './responseVo'

export enum HttpCode {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export class Result {
  private readonly statusCode: number
  private readonly message: string
  private readonly data?: object

  constructor (statusCode: number, message: string, data?: object) {
    this.statusCode = statusCode
    this.message = message
    this.data = data
  }

  /***
   * Serverless: According to the API Gateway specs, the body content must be stringified
  ***/
  bodyToString (): ResponseVO {
    return {
      statusCode: this.statusCode,
      message: this.message,
      data: this.data
    }
  }
}

export const success = (data: object): ResponseVO => {
  const result = new Result(HttpCode.OK, 'success', data)
  return result.bodyToString()
}

export const error = (code = HttpCode.INTERNAL_SERVER_ERROR, message: string): ResponseVO => {
  const result = new Result(code, message)
  return result.bodyToString()
}
