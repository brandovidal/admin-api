import type { User } from '@prisma/client'

import { InternalErrorJSON, ValidateErrorJSON } from '../../interfaces/response'
import { findUser } from './repository'

import { Get, Query, Response, Route, SuccessResponse, Tags } from 'tsoa'

@Tags('Auth')
@Route('api/auth')
export default class AuthController {
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ValidateErrorJSON>(400, 'Validation Failed')
  @SuccessResponse('201', 'Created')
  @Get('/')
  public async findUser(@Query() email: string): Promise<User> {
    return await findUser(email)
  }
}
