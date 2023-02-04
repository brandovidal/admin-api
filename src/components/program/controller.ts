import type { Program } from '@prisma/client'

import { createProgram, getPrograms, deleteProgram, updateProgram, getProgramById, getProgram } from './repository'

import type { ForbiddenErrorJSON, InternalErrorJSON, ValidateErrorJSON } from '../../interfaces/response'
import { ProgramsResponse } from '../../interfaces/program'

import { Get, Post, Put, Delete, Path, Route, Body, SuccessResponse, Query, Response, OperationId, Tags, Res } from 'tsoa'

@Tags('Program')
@Route('/api/programs')
export default class ProgramController {
  /**
   * The `getPrograms` function takes in a `name`, `email`, `page` and `size` query parameter and returns a `ProgramsResponse`
  * @param {string} [name] - string
  * @param {string} [email] - string
  * @param [page=1] - The page number of the results to return.
  * @param [size=10] - The number of items to return per page.
  * @returns The return  is ProgramsResponse.
  */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/')
  @OperationId('getPrograms')
  public async getPrograms(@Query() name?: string, @Query() email?: string, @Query() page = 1, @Query() size = 10): Promise<ProgramsResponse> {
    return await getPrograms(name, email, page, size)
  }

  /**
  * The `getProgram` function takes in a `name` and `email` query parameter and returns a `Program`
  * object
  * @param {string} [name] - string - This is the name of the program.
  * @param {string} [email] - The email of the program to get.
  * @returns A promise of a Program object
  */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/program')
  public async getProgram(@Query() name?: string, @Query() email?: string): Promise<Program> {
    return await getProgram(name, email)
  }

  /**
   * The `getProgramId` function takes in a `id` path parameter and returns a promise of a Program object
   * @param {string} id - string - This is the path parameter. It's the id of the program we want to get.
   * @returns The program object
   */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/{id}')
  public async getProgramId(@Path() id: string): Promise<Program | null> {
    return await getProgramById(id)
  }

  /**
   * The `createProgram` function takes in a `Program` object and returns a promise of a Program object
   * @param {Program} requestBody - Program
   * @returns A promise of a program object
   */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ValidateErrorJSON>(400, 'Validation Failed')
  @SuccessResponse('201', 'Created')
  @Post('/')
  public async createProgram(@Body() requestBody: Program): Promise<Program> {
    return await createProgram(requestBody)
  }

  /**
   * The `updateProgram` function takes in a `id` path parameter and a `Program` object and returns a promise of a Program object
   * @param {string} id - string - This is the id of the program we want to update.
   * @param {Program} requestBody - This is the body of the request. It's the data that the program is
   * sending to the server.
   * @returns The updated program
   */
  @Put('/{id}')
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ValidateErrorJSON>(400, 'Validation Failed')
  public async updateProgram(@Path() id: string, @Body() requestBody: Program): Promise<Program> {
    return await updateProgram(id, requestBody)
  }

  /**
   * The `deleteProgram` function takes in a `id` path parameter and returns a promise of a Program object
   * @param {string} id - string - This is the path parameter. It's the id of the program we want to
   * delete.
   * @returns The program that was deleted
   */
  @Delete('/{id}')
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  public async deleteProgram(@Path() id: string): Promise<Program> {
    return await deleteProgram(id)
  }
}
