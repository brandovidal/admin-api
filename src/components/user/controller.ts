import type { User } from '@prisma/client'

import { createUser, getUsers, deleteUser, updateUser, getUserById, getUser } from './repository'

import type { ForbiddenErrorJSON, InternalErrorJSON, ValidateErrorJSON } from '../../interfaces/response'

import { Get, Post, Put, Delete, Path, Route, Body, SuccessResponse, Query, Response, OperationId, Tags } from 'tsoa'

@Tags('User')
@Route('/api/users')
export default class UserController {
  /**
   * The `getUsers` function takes in a `name`, `email`, `page` and `size` query parameter and returns a `UsersResponse`
  * @param {string} [name] - string
  * @param {string} [email] - string
  * @param [page=1] - The page number of the results to return.
  * @param [size=10] - The number of items to return per page.
  * @returns The return  is UsersResponse.
  */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/')
  @OperationId('getUsers')
  public async getUsers(@Query() name?: string, @Query() email?: string, @Query() page = 1, @Query() size = 10) {
    return await getUsers(name, email, page, size)
  }

  /**
  * The `getUser` function takes in a `name` and `email` query parameter and returns a `User`
  * object
  * @param {string} [name] - string - This is the name of the user.
  * @param {string} [email] - The email of the user to get.
  * @returns A promise of a User object
  */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/user')
  public async getUser(@Query() name?: string, @Query() email?: string) {
    return await getUser(name, email)
  }

  /**
   * The `getUserId` function takes in a `id` path parameter and returns a promise of a User object
   * @param {string} id - string - This is the path parameter. It's the id of the user we want to get.
   * @returns The user object
   */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/{id}')
  public async getUserId(@Path() id: string) {
    return await getUserById(id)
  }

  /**
   * The `createUser` function takes in a `User` object and returns a promise of a User object
   * @param {User} requestBody - User
   * @returns A promise of a user object
   */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ValidateErrorJSON>(400, 'Validation Failed')
  @SuccessResponse('201', 'Created')
  @Post('/')
  public async createUser(@Body() requestBody: User) {
    return await createUser(requestBody)
  }

  /**
   * The `updateUser` function takes in a `id` path parameter and a `User` object and returns a promise of a User object
   * @param {string} id - string - This is the id of the user we want to update.
   * @param {User} requestBody - This is the body of the request. It's the data that the user is
   * sending to the server.
   * @returns The updated user
   */
  @Put('/{id}')
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ValidateErrorJSON>(400, 'Validation Failed')
  public async updateUser(@Path() id: string, @Body() requestBody: User) {
    return await updateUser(id, requestBody)
  }

  /**
   * The `deleteUser` function takes in a `id` path parameter and returns a promise of a User object
   * @param {string} id - string - This is the path parameter. It's the id of the user we want to
   * delete.
   * @returns The user that was deleted
   */
  @Delete('/{id}')
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  public async deleteUser(@Path() id: string) {
    return await deleteUser(id)
  }
}
