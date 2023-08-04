import { HttpCode, type SuccessType } from '../types/response'

export default class BaseSuccess {
  // FIXME: change code to boolean
  private readonly status
  // FIXME: it is removed
  private readonly code
  // FIXME: this is optional
  private readonly message
  private readonly data
  // TODO: add meta as aditional data

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
