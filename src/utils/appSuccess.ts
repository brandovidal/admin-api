import { type ResponseType } from '../types/response'

export default class BaseSuccess {
  private readonly status
  private readonly data
  private readonly meta?

  constructor (
    data?: object | string | null,
    meta?: object | null
  ) {
    this.status = true
    this.data = data
    this.meta = meta
  }

  values (): ResponseType {
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
  data: object | string | null = null,
  meta: object | null = {}
): ResponseType => {
  return new BaseSuccess(data, meta).values()
}

export const AppSuccessStringify = (
  data = null,
  meta = {}
): string => {
  return new BaseSuccess(data, meta).stringify()
}
