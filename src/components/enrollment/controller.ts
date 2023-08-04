import { Enrollment } from '@prisma/client'

import { createEnrollment, getEnrollments, deleteEnrollment, updateEnrollment, getEnrollmentById, getEnrollment } from './repository'

import type { ForbiddenErrorJSON, InternalErrorJSON, ValidateErrorJSON } from '../../interfaces/response'
import { type EnrollmentsResponse } from '../../interfaces/enrollment'

import { Get, Post, Put, Delete, Path, Route, Body, SuccessResponse, Query, Response, OperationId, Tags } from 'tsoa'

@Tags('Enrollment')
@Route('/api/enrollments')
export default class EnrollmentController {
  /**
   * The `getEnrollments` function takes in a `startDate`, `endDate`, `page` and `limit` query parameter and returns a `EnrollmentsResponse`
  * @param {string} [startDate] - string
  * @param {string} [endDate] - string
  * @param [page=1] - The page number of the results to return.
  * @param [limit=10] - The number of items to return per page.
  * @returns The return  is EnrollmentsResponse.
  */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/')
  @OperationId('getEnrollments')
  public async getEnrollments (@Query() startDate?: string, @Query() endDate?: string, @Query() page = 1, @Query() limit = 10): Promise<EnrollmentsResponse> {
    return await getEnrollments(startDate, endDate, page, limit)
  }

  /**
  * The `getEnrollment` function takes in a `startDate` and `endDate` query parameter and returns a `Enrollment`
  * object
  * @param {string} [startDate] - string - This is the startDate of the enrollment.
  * @param {string} [endDate] - The endDate of the enrollment to get.
  * @returns A promise of a Enrollment object
  */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/enrollment')
  public async getEnrollment (@Query() startDate?: string, @Query() endDate?: string): Promise<Enrollment> {
    return await getEnrollment(startDate, endDate)
  }

  /**
   * The `getEnrollmentById` function takes in a `id` path parameter and returns a promise of a Enrollment object
   * @param {string} id - string - This is the path parameter. It's the id of the enrollment we want to get.
   * @returns The enrollment object
   */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/{id}')
  public async getEnrollmentById (@Path() id: string): Promise<Enrollment> {
    return await getEnrollmentById(id)
  }

  /**
   * The `createEnrollment` function takes in a `Enrollment` object and returns a promise of a Enrollment object
   * @param {Enrollment} requestBody - Enrollment
   * @returns A promise of a enrollment object
   */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ValidateErrorJSON>(400, 'Validation Failed')
  @SuccessResponse('201', 'Created')
  @Post('/')
  public async createEnrollment (@Body() requestBody: Enrollment): Promise<Enrollment> {
    return await createEnrollment(requestBody)
  }

  /**
   * The `updateEnrollment` function takes in a `id` path parameter and a `Enrollment` object and returns a promise of a Enrollment object
   * @param {string} id - string - This is the id of the enrollment we want to update.
   * @param {Enrollment} requestBody - This is the body of the request. It's the data that the enrollment is
   * sending to the server.
   * @returns The updated enrollment
   */
  @Put('/{id}')
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ValidateErrorJSON>(400, 'Validation Failed')
  public async updateEnrollment (@Path() id: string, @Body() requestBody: Enrollment): Promise<Enrollment> {
    return await updateEnrollment(id, requestBody)
  }

  /**
   * The `deleteEnrollment` function takes in a `id` path parameter and returns a promise of a number object
   * @param {string} id - string - This is the path parameter. It's the id of the enrollment we want to
   * delete.
   * @returns The number that was deleted
   */
  @Delete('/{id}')
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  public async deleteEnrollment (@Path() id: string): Promise<number> {
    return await deleteEnrollment(id)
  }
}
