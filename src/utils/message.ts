import { ErrorModel } from '../types/error'
import { HttpCode } from '../types/http-code'
import { ResponseModel } from '../types/response'

export class Result {
  private readonly status: number
  private readonly code: string
  private readonly message: string
  private readonly data?: object | null
  private readonly error?: ErrorModel | ErrorModel[] | null

  constructor (status: number, code: string, message: string, data?: object | null, error?: ErrorModel | ErrorModel[] | null) {
    this.status = status
    this.code = code
    this.message = message
    this.data = data
    this.error = error
  }

  /***
   * Serverless: According to the API Gateway specs, the body content must be stringified
  ***/
  bodyToString (): ResponseModel {
    return {
      status: this.status,
      code: this.code,
      message: this.message,
      data: this.data,
      error: this.error
    }
  }
}

export const success = ({ status = HttpCode.OK, data = null, code = '', message = 'success', error = null }: ResponseModel): ResponseModel => {
  const result = new Result(status, code, message, data, error)
  return result.bodyToString()
}

export const error = ({ status = HttpCode.INTERNAL_SERVER_ERROR, data = null, code = '', message = 'error', error }: ResponseModel): ResponseModel => {
  const result = new Result(status, code, message, data, error)
  return result.bodyToString()
}
