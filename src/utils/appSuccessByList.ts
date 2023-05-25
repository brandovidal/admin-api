import { HttpCode, type SuccessTypeByList } from '../types/response'

export default class BaseSuccessByList {
  private readonly status
  private readonly code
  private readonly message
  private readonly data
  private readonly count
  private readonly total

  constructor (
    status: number,
    code: string,
    message: string,
    count: number,
    total: number,
    data?: object | string | null
  ) {
    this.status = status
    this.code = code
    this.message = message
    this.data = data
    this.count = count
    this.total = total
  }

  values (): SuccessTypeByList {
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
    return JSON.stringify(this.values())
  }
}

export const AppSuccessByList = (
  status = HttpCode.OK,
  code = '',
  message = 'error',
  data: object | string | null = null,
  count = 0,
  total = 0
): SuccessTypeByList => {
  return new BaseSuccessByList(
    status,
    code,
    message,
    count,
    total,
    data
  ).values()
}

export const AppSuccessStringifyByList = (
  status = HttpCode.OK,
  code = '',
  message = 'error',
  data = null,
  count = 0,
  total = 0
): string => {
  return new BaseSuccessByList(
    status,
    code,
    message,
    count,
    total,
    data
  ).stringify()
}
