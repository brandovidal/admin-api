import type { Course } from '@prisma/client'

import { createCourse, getCourses, deleteCourse, updateCourse, getCourseById, getCourse } from './repository'

import type { ForbiddenErrorJSON, InternalErrorJSON, ValidateErrorJSON } from '../../interfaces/response'
import { CoursesResponse } from '../../interfaces/course'

import { Get, Post, Put, Delete, Path, Route, Body, SuccessResponse, Query, Response, OperationId, Tags, Res } from 'tsoa'

@Tags('Course')
@Route('/api/courses')
export default class CourseController {
  /**
   * The `getCourses` function takes in a `name`, `email`, `page` and `size` query parameter and returns a `CoursesResponse`
  * @param {string} [name] - string
  * @param {string} [email] - string
  * @param [page=1] - The page number of the results to return.
  * @param [size=10] - The number of items to return per page.
  * @returns The return  is CoursesResponse.
  */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/')
  @OperationId('getCourses')
  public async getCourses(@Query() name?: string, @Query() email?: string, @Query() page = 1, @Query() size = 10): Promise<CoursesResponse> {
    return await getCourses(name, email, page, size)
  }

  /**
  * The `getCourse` function takes in a `name` and `email` query parameter and returns a `Course`
  * object
  * @param {string} [name] - string - This is the name of the course.
  * @param {string} [email] - The email of the course to get.
  * @returns A promise of a Course object
  */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/course')
  public async getCourse(@Query() name?: string, @Query() email?: string): Promise<Course> {
    return await getCourse(name, email)
  }

  /**
   * The `getCourseById` function takes in a `id` path parameter and returns a promise of a Course object
   * @param {string} id - string - This is the path parameter. It's the id of the course we want to get.
   * @returns The course object
   */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/{id}')
  public async getCourseById(@Path() id: string): Promise<Course> {
    return await getCourseById(id)
  }

  /**
   * The `createCourse` function takes in a `Course` object and returns a promise of a Course object
   * @param {Course} requestBody - Course
   * @returns A promise of a course object
   */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ValidateErrorJSON>(400, 'Validation Failed')
  @SuccessResponse('201', 'Created')
  @Post('/')
  public async createCourse(@Body() requestBody: Course): Promise<Course> {
    return await createCourse(requestBody)
  }

  /**
   * The `updateCourse` function takes in a `id` path parameter and a `Course` object and returns a promise of a Course object
   * @param {string} id - string - This is the id of the course we want to update.
   * @param {Course} requestBody - This is the body of the request. It's the data that the course is
   * sending to the server.
   * @returns The updated course
   */
  @Put('/{id}')
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ValidateErrorJSON>(400, 'Validation Failed')
  public async updateCourse(@Path() id: string, @Body() requestBody: Course): Promise<Course> {
    return await updateCourse(id, requestBody)
  }

  /**
   * The `deleteCourse` function takes in a `id` path parameter and returns a promise of a number object
   * @param {string} id - string - This is the path parameter. It's the id of the course we want to
   * delete.
   * @returns The number that was deleted
   */
  @Delete('/{id}')
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  public async deleteCourse(@Path() id: string): Promise<number> {
    return await deleteCourse(id)
  }
}
