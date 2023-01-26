import { HttpCode, ErrorType, SuccessType } from '../types/response'

export default class BaseSuccess {
  private readonly status
  private readonly code
  private readonly message
  private readonly data
  private readonly count?
  private readonly total?

  constructor (status: number, code: string, message: string, data: object | null, count?: number, total?: number) {
    this.status = status
    this.code = code
    this.message = message
    this.data = data
    this.count = count
    this.total = total
  }

  getValues (): SuccessType {
    return {
      status: this.status,
      code: this.code,
      message: this.message,
      data: this.data,
      count: this.count,
      total: this.total
    }
  }

  stringify (): string {
    return JSON.stringify(this.getValues())
  }
}

export const AppSuccess = (status = HttpCode.OK, code = '', message = 'error', data = null, count = 0, total = 0): ErrorType => {
  return new BaseSuccess(status, code, message, data, count, total).getValues()
}

export const AppSuccessStringify = (status = HttpCode.OK, code = '', message = 'error', data = null, count = 0, total = 0): string => {
  return new BaseSuccess(status, code, message, data, count, total).stringify()
}
