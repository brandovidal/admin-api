import { Membership } from '@prisma/client'

import { createMembership, getMemberships, deleteMembership, updateMembership, getMembershipById, getMembership } from './repository'

import type { ForbiddenErrorJSON, InternalErrorJSON, ValidateErrorJSON } from '../../interfaces/response'
import { type MembershipsResponse } from '../../interfaces/membership'

import { Get, Post, Put, Delete, Path, Route, Body, SuccessResponse, Query, Response, OperationId, Tags, Res } from 'tsoa'

@Tags('Membership')
@Route('/api/memberships')
export default class MembershipController {
  /**
   * The `getMemberships` function takes in a `startDate`, `endDate`, `page` and `limit` query parameter and returns a `MembershipsResponse`
  * @param {string} [startDate] - string
  * @param {string} [endDate] - string
  * @param [page=1] - The page number of the results to return.
  * @param [limit=10] - The number of items to return per page.
  * @returns The return  is MembershipsResponse.
  */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/')
  @OperationId('getMemberships')
  public async getMemberships (@Query() startDate?: string, @Query() endDate?: string, @Query() page = 1, @Query() limit = 10): Promise<MembershipsResponse> {
    return await getMemberships(startDate, endDate, page, limit)
  }

  /**
  * The `getMembership` function takes in a `startDate` and `endDate` query parameter and returns a `Membership`
  * object
  * @param {string} [startDate] - string - This is the startDate of the membership.
  * @param {string} [endDate] - The endDate of the membership to get.
  * @returns A promise of a Membership object
  */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/membership')
  public async getMembership (@Query() startDate?: string, @Query() endDate?: string): Promise<Membership> {
    return await getMembership(startDate, endDate)
  }

  /**
   * The `getMembershipById` function takes in a `id` path parameter and returns a promise of a Membership object
   * @param {string} id - string - This is the path parameter. It's the id of the membership we want to get.
   * @returns The membership object
   */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/{id}')
  public async getMembershipById (@Path() id: string): Promise<Membership> {
    return await getMembershipById(id)
  }

  /**
   * The `createMembership` function takes in a `Membership` object and returns a promise of a Membership object
   * @param {Membership} requestBody - Membership
   * @returns A promise of a membership object
   */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ValidateErrorJSON>(400, 'Validation Failed')
  @SuccessResponse('201', 'Created')
  @Post('/')
  public async createMembership (@Body() requestBody: Membership): Promise<Membership> {
    return await createMembership(requestBody)
  }

  /**
   * The `updateMembership` function takes in a `id` path parameter and a `Membership` object and returns a promise of a Membership object
   * @param {string} id - string - This is the id of the membership we want to update.
   * @param {Membership} requestBody - This is the body of the request. It's the data that the membership is
   * sending to the server.
   * @returns The updated membership
   */
  @Put('/{id}')
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ValidateErrorJSON>(400, 'Validation Failed')
  public async updateMembership (@Path() id: string, @Body() requestBody: Membership): Promise<Membership> {
    return await updateMembership(id, requestBody)
  }

  /**
   * The `deleteMembership` function takes in a `id` path parameter and returns a promise of a number object
   * @param {string} id - string - This is the path parameter. It's the id of the membership we want to
   * delete.
   * @returns The number that was deleted
   */
  @Delete('/{id}')
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  public async deleteMembership (@Path() id: string): Promise<number> {
    return await deleteMembership(id)
  }
}
