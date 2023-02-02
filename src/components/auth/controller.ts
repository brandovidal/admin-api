import { User } from '@prisma/client'

import { InternalErrorJSON, ValidateErrorJSON } from '../../interfaces/response'
import { UserLoggedResponse } from '../../interfaces/user'

import { login, register } from './repository'

import { LoginUserInput } from './schema'

import { Body, Post, Response, Route, SuccessResponse, Tags } from 'tsoa'

@Tags('Auth')
@Route('/api/auth')
export default class AuthController {
  /**
   * It takes a request body, which is a `LoginUserInput`, and returns the result of the login function,
   * which is a Promise of a `User`
   * @param {LoginUserInput} requestBody - LoginUserInput
   * @returns The login function is being returned.
   */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ValidateErrorJSON>(400, 'Validation Failed')
  @SuccessResponse('200', 'Login')
  @Post('/login')
  public async login (@Body() requestBody: LoginUserInput): Promise<UserLoggedResponse> {
    return await login(requestBody)
  }

  /**
   * It takes a request body, which is a `User`, and returns the result of the register
   * function, which is a Promise of a `User`
   * @param {User} requestBody - User
   * @returns The result of the register function
   */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ValidateErrorJSON>(400, 'Validation Failed')
  @SuccessResponse('200', 'Register')
  @Post('/register')
  public async register (@Body() requestBody: User): Promise<User> {
    return await register(requestBody)
  }
}
