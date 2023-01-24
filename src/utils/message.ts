import { ErrorModel } from '../types/error'
import { HttpCode } from '../types/http-code'
import { ResponseModel } from '../types/response'

export class Result {
  private readonly status: number
  private readonly code: string
  private readonly message: string
  private readonly data?: object | null
  private readonly count?: number
  private readonly total?: number
  private readonly error?: ErrorModel | ErrorModel[] | null

  constructor (status: number, code: string, message: string, data?: object | null, count?: number, total?: number, error?: ErrorModel | ErrorModel[] | null) {
    this.status = status
    this.code = code
    this.message = message
    this.data = data
    this.count = count
    this.total = total
    this.error = error
  }

  get (): ResponseModel {
    return {
      status: this.status,
      code: this.code,
      message: this.message,
      data: this.data,
      count: this.count,
      total: this.total,
      error: this.error
    }
  }

  bodyToString (): string {
    return JSON.stringify(this.get())
  }
}

export const success = ({ status = HttpCode.OK, data = null, count = 0, total = 0, code = '', message = 'success', error = null }: ResponseModel): ResponseModel => {
  const result = new Result(status, code, message, data, count, total, error)
  return result.get()
}

export const error = ({ status = HttpCode.INTERNAL_SERVER_ERROR, data = null, count = 0, total = 0, code = '', message = 'error', error }: ResponseModel): ResponseModel => {
  const result = new Result(status, code, message, data, count, total, error)
  return result.get()
}
