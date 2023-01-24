import { User } from '@prisma/client'

import { Get, Post, Put, Delete, Path, Route, Body, SuccessResponse, Query } from 'tsoa'

import { createUser, getUsers, deleteUser, updateUser, getUserById, getUsersPaginate } from './repository'

import { UserResponse } from '../../interfaces/user'

@Route('user')
export default class UserController {
  @Get('/')
  public async getUsers (): Promise<User[] | null> {
    return await getUsers()
  }

  @Get('/all')
  public async getUsersPaginate (@Query() name: string, @Query() email: string, @Query() page: number, @Query() size: number): Promise<UserResponse> {
    return await getUsersPaginate(name, email, page, size)
  }

  @Get('/{id}')
  public async getUserId (@Path() id: string): Promise<User | null> {
    return await getUserById(id)
  }

  @SuccessResponse('201', 'Created')
  @Post('/')
  public async createUser (@Body() requestBody: User): Promise<User> {
    return await createUser(requestBody)
  }

  @Put('/{id}')
  public async updateUser (@Path() id: string, @Body() requestBody: User): Promise<User> {
    return await updateUser(id, requestBody)
  }

  @Delete('/{id}')
  public async deleteUser (@Path() id: string): Promise<User> {
    return await deleteUser(id)
  }
}
