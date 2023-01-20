import { ResponseVO } from '../model/vo/responseVo'

export enum StatusCode {
  success = 200,
}

export class Result {
  private readonly statusCode: number
  private readonly code: number
  private readonly message: string
  private readonly data? = null

  constructor (statusCode: number, code: number, message: string, data?: any) {
    this.statusCode = statusCode
    this.code = code
    this.message = message
    this.data = data
  }

  /**
     * Serverless: According to the API Gateway specs, the body content must be stringified
     */
  bodyToString (): ResponseVO {
    return {
      statusCode: this.statusCode,
      body: {
        code: this.code,
        message: this.message,
        data: this.data
      }
    }
  }
}

export const success = (data: object): ResponseVO => {
  const result = new Result(StatusCode.success, 0, 'success', data)

  return result.bodyToString()
}

export const error = (code = 1000, message: string): ResponseVO => {
  const result = new Result(StatusCode.success, code, message)

  console.log(result.bodyToString())
  return result.bodyToString()
}
