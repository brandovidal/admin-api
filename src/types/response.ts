export interface ErrorType {
  status: number
  code: string
  message: string
  validations?: ValidationType[] | null
}

export interface ValidationType {
  name: string | number
  path?: string | number
  code?: string
  message: string
}

export interface SuccessTypeByList {
  status: number
  code: string
  message: string
  data?: object | string | null
  count: number
  total: number
}

export interface SuccessType {
  status: number
  code: string
  message: string
  data?: object | string | null
}

export enum HttpCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500
}
