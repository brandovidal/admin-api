import { HttpCode, type SuccessType } from '../types/response'

export default class BaseSuccess {
  private readonly status
  private readonly code
  private readonly message
  private readonly data

  constructor (
    status: number,
    code: string,
    message: string,
    data?: object | string | null
  ) {
    this.status = status
    this.code = code
    this.message = message
    this.data = data
  }

  values (): SuccessType {
    return {
      status: this.status,
      code: this.code,
      message: this.message,
      data: this.data
    }
  }

  stringify (): string {
    return JSON.stringify(this.values())
  }
}

export const AppSuccess = (
  status = HttpCode.OK,
  code = '',
  message = 'error',
  data: object | string | null = null
): SuccessType => {
  return new BaseSuccess(status, code, message, data).values()
}

export const AppSuccessStringify = (
  status = HttpCode.OK,
  code = '',
  message = 'error',
  data = null
): string => {
  return new BaseSuccess(status, code, message, data).stringify()
}
