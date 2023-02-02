import type { User } from '@prisma/client'

import { InternalErrorJSON, ValidateErrorJSON } from '../../interfaces/response'
import { login } from './repository'

import { Body, Post, Query, Response, Route, SuccessResponse, Tags } from 'tsoa'

@Tags('Auth')
@Route('api/auth')
export default class AuthController {
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ValidateErrorJSON>(400, 'Validation Failed')
  @SuccessResponse('20', 'Login')
  @Post('/login')
  public async login(@Body() requestBody: User) {
    return await login(requestBody)
  }
}
