import type { Certificate } from '@prisma/client'

import { createCertificate, getCertificates, deleteCertificate, updateCertificate, getCertificateById, getCertificate } from './repository'

import type { ForbiddenErrorJSON, InternalErrorJSON, ValidateErrorJSON } from '../../interfaces/response'
import { CertificatesResponse } from '../../interfaces/certificate'

import { Get, Post, Put, Delete, Path, Route, Body, SuccessResponse, Query, Response, OperationId, Tags, Res } from 'tsoa'

@Tags('Certificate')
@Route('/api/certificates')
export default class CertificateController {
  /**
   * The `getCertificates` function takes in a `name`, `email`, `page` and `size` query parameter and returns a `CertificatesResponse`
  * @param {string} [name] - string
  * @param {string} [email] - string
  * @param [page=1] - The page number of the results to return.
  * @param [size=10] - The number of items to return per page.
  * @returns The return  is CertificatesResponse.
  */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/')
  @OperationId('getCertificates')
  public async getCertificates(@Query() name?: string, @Query() email?: string, @Query() page = 1, @Query() size = 10): Promise<CertificatesResponse> {
    return await getCertificates(name, email, page, size)
  }

  /**
  * The `getCertificate` function takes in a `name` and `email` query parameter and returns a `Certificate`
  * object
  * @param {string} [name] - string - This is the name of the certificate.
  * @param {string} [email] - The email of the certificate to get.
  * @returns A promise of a Certificate object
  */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/certificate')
  public async getCertificate(@Query() name?: string, @Query() email?: string): Promise<Certificate> {
    return await getCertificate(name, email)
  }

  /**
   * The `getCertificateById` function takes in a `id` path parameter and returns a promise of a Certificate object
   * @param {string} id - string - This is the path parameter. It's the id of the certificate we want to get.
   * @returns The certificate object
   */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/{id}')
  public async getCertificateById(@Path() id: string): Promise<Certificate> {
    return await getCertificateById(id)
  }

  /**
   * The `createCertificate` function takes in a `Certificate` object and returns a promise of a Certificate object
   * @param {Certificate} requestBody - Certificate
   * @returns A promise of a certificate object
   */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ValidateErrorJSON>(400, 'Validation Failed')
  @SuccessResponse('201', 'Created')
  @Post('/')
  public async createCertificate(@Body() requestBody: Certificate): Promise<Certificate> {
    return await createCertificate(requestBody)
  }

  /**
   * The `updateCertificate` function takes in a `id` path parameter and a `Certificate` object and returns a promise of a Certificate object
   * @param {string} id - string - This is the id of the certificate we want to update.
   * @param {Certificate} requestBody - This is the body of the request. It's the data that the certificate is
   * sending to the server.
   * @returns The updated certificate
   */
  @Put('/{id}')
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ValidateErrorJSON>(400, 'Validation Failed')
  public async updateCertificate(@Path() id: string, @Body() requestBody: Certificate): Promise<Certificate> {
    return await updateCertificate(id, requestBody)
  }

  /**
   * The `deleteCertificate` function takes in a `id` path parameter and returns a promise of a number object
   * @param {string} id - string - This is the path parameter. It's the id of the certificate we want to
   * delete.
   * @returns The number that was deleted
   */
  @Delete('/{id}')
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  public async deleteCertificate(@Path() id: string): Promise<number> {
    return await deleteCertificate(id)
  }
}
