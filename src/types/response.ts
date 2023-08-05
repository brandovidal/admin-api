export interface ValidationType {
  name: string | number
  path?: string | number
  code?: string
  message: string
}
export interface ErrorType {
  code: number
  name: string
  message: string
  details?: ValidationType[] | null
}
export interface PaginationType {
  page: number
  pageSize: number
  pageCount: number
  total: number
}
export interface MetaType {
  pagination: PaginationType
}
export interface ResponseType {
  status: boolean
  data?: object | string | null
  meta?: MetaType | object | null
  error?: ErrorType | object | null
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
