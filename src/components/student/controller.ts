import type { Student } from '@prisma/client'

import { createStudent, getStudents, deleteStudent, updateStudent, getStudentById, getStudent } from './repository'

import type { ForbiddenErrorJSON, InternalErrorJSON, ValidateErrorJSON } from '../../interfaces/response'
import { StudentsResponse } from '../../interfaces/student'

import { Get, Post, Put, Delete, Path, Route, Body, SuccessResponse, Query, Response, OperationId, Tags, Res } from 'tsoa'

@Tags('Student')
@Route('/api/students')
export default class StudentController {
  /**
   * The `getStudents` function takes in a `name`, `email`, `page` and `size` query parameter and returns a `StudentsResponse`
  * @param {string} [name] - string
  * @param {string} [email] - string
  * @param [page=1] - The page number of the results to return.
  * @param [size=10] - The number of items to return per page.
  * @returns The return  is StudentsResponse.
  */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/')
  @OperationId('getStudents')
  public async getStudents(@Query() name?: string, @Query() email?: string, @Query() page = 1, @Query() size = 10): Promise<StudentsResponse> {
    return await getStudents(name, email, page, size)
  }

  /**
  * The `getStudent` function takes in a `name` and `email` query parameter and returns a `Student`
  * object
  * @param {string} [name] - string - This is the name of the student.
  * @param {string} [email] - The email of the student to get.
  * @returns A promise of a Student object
  */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/student')
  public async getStudent(@Query() name?: string, @Query() email?: string): Promise<Student> {
    return await getStudent(name, email)
  }

  /**
   * The `getStudentById` function takes in a `id` path parameter and returns a promise of a Student object
   * @param {string} id - string - This is the path parameter. It's the id of the student we want to get.
   * @returns The student object
   */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/{id}')
  public async getStudentById(@Path() id: string): Promise<Student> {
    return await getStudentById(id)
  }

  /**
   * The `createStudent` function takes in a `Student` object and returns a promise of a Student object
   * @param {Student} requestBody - Student
   * @returns A promise of a student object
   */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ValidateErrorJSON>(400, 'Validation Failed')
  @SuccessResponse('201', 'Created')
  @Post('/')
  public async createStudent(@Body() requestBody: Student): Promise<Student> {
    return await createStudent(requestBody)
  }

  /**
   * The `updateStudent` function takes in a `id` path parameter and a `Student` object and returns a promise of a Student object
   * @param {string} id - string - This is the id of the student we want to update.
   * @param {Student} requestBody - This is the body of the request. It's the data that the student is
   * sending to the server.
   * @returns The updated student
   */
  @Put('/{id}')
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ValidateErrorJSON>(400, 'Validation Failed')
  public async updateStudent(@Path() id: string, @Body() requestBody: Student): Promise<Student> {
    return await updateStudent(id, requestBody)
  }

  /**
   * The `deleteStudent` function takes in a `id` path parameter and returns a promise of a number object
   * @param {string} id - string - This is the path parameter. It's the id of the student we want to
   * delete.
   * @returns The number that was deleted
   */
  @Delete('/{id}')
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  public async deleteStudent(@Path() id: string): Promise<number> {
    return await deleteStudent(id)
  }
}
