import { ErrorModel } from './error'

export class ResponseModel {
  status = 400
  code = ''
  message = ''
  data?: object | null = null
  error?: ErrorModel | ErrorModel[] | null = null
}
