import { ErrorModel } from './error'

export class ResponseModel {
  status = 400
  code = ''
  message = ''
  data?: object | null = null
  count?: number = 0
  error?: ErrorModel | ErrorModel[] | null = null
}
