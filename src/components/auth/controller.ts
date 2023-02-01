import type { User } from '@prisma/client'

import { InternalErrorJSON, ValidateErrorJSON } from '../../interfaces/response'
import { Body, Response, Route, SuccessResponse, Tags } from 'tsoa'

import { login } from './repository'

@Tags('Auth')
@Route('api/auth')
export default class UserController {
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ValidateErrorJSON>(400, 'Validation Failed')
  @SuccessResponse('201', 'Created')
  // @Post('/')
  public async login (@Body() email: string): Promise<User> {
    return await login(email)
  }
}
