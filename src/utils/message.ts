import { HttpCode, type ErrorType, type SuccessType } from '../types/response'

export class Result {
  private readonly status: number
  private readonly code: string
  private readonly message: string
  private readonly data?: object | null
  private readonly count?: number
  private readonly total?: number
  private readonly error?: ErrorType | ErrorType[] | null

  constructor (status: number, code: string, message: string, data?: object | null, count?: number, total?: number, error?: ErrorType | ErrorType[] | null) {
    this.status = status
    this.code = code
    this.message = message
    this.data = data
    this.count = count
    this.total = total
    this.error = error
  }

  get (): { status: number, code: string, message: string, data: object | null | undefined, count: number | undefined, total: number | undefined, error: ErrorType | ErrorType[] | null | undefined } {
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

export const success = ({ status = HttpCode.OK, data = null, count = 0, total = 0, code = '', message = 'success' }: SuccessType): SuccessType => {
  const result = new Result(status, code, message, data, count, total)
  return result.get()
}

export const error = ({ status = HttpCode.INTERNAL_SERVER_ERROR, data = null, count = 0, total = 0, code = '', message = 'error' }: SuccessType): SuccessType => {
  const result = new Result(status, code, message, data, count, total)
  return result.get()
}
