import { HttpCode, type SuccessType } from '../types/response'

export default class BaseSuccess {
  // FIXME: change code to boolean
  private readonly status
  // FIXME: it is removed
  // FIXME: this is optional
  private readonly data
  // TODO: add meta as aditional data
  private readonly meta?

  constructor (
    status: number | boolean,
    code: string,
    message: string,
    data?: object | string | null,
    meta?: object | null
  ) {
    this.status = true
    this.data = data
    this.meta = meta
  }

  values (): SuccessType {
    return {
      status: this.status,
      data: this.data,
      meta: this.meta
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
  data: object | string | null = null,
  meta: object | null = {}
): SuccessType => {
  return new BaseSuccess(status, code, message, data, meta).values()
}

export const AppSuccessStringify = (
  status = HttpCode.OK,
  code = '',
  message = 'error',
  data = null,
  meta = {}
): string => {
  return new BaseSuccess(status, code, message, data, meta).stringify()
}
