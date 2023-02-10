import type { Payment } from '@prisma/client'

import { createPayment, getPayments, deletePayment, updatePayment, getPaymentById, getPayment } from './repository'

import type { ForbiddenErrorJSON, InternalErrorJSON, ValidateErrorJSON } from '../../interfaces/response'
import { PaymentsResponse } from '../../interfaces/payment'

import { Get, Post, Put, Delete, Path, Route, Body, SuccessResponse, Query, Response, OperationId, Tags, Res } from 'tsoa'

@Tags('Payment')
@Route('/api/payments')
export default class PaymentController {
  /**
   * The `getPayments` function takes in a `voucher`, `amount`, `page` and `size` query parameter and returns a `PaymentsResponse`
  * @param {string} [voucher] - string
  * @param {string} [amount] - string
  * @param [page=1] - The page number of the results to return.
  * @param [size=10] - The number of items to return per page.
  * @returns The return  is PaymentsResponse.
  */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/')
  @OperationId('getPayments')
  public async getPayments(@Query() voucher?: string, @Query() amount?: string, @Query() page = 1, @Query() size = 10): Promise<PaymentsResponse> {
    return await getPayments(voucher, amount, page, size)
  }

  /**
  * The `getPayment` function takes in a `voucher` and `amount` query parameter and returns a `Payment`
  * object
  * @param {string} [voucher] - string - This is the voucher of the payment.
  * @param {string} [amount] - The amount of the payment to get.
  * @returns A promise of a Payment object
  */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/payment')
  public async getPayment(@Query() voucher?: string, @Query() amount?: string): Promise<Payment> {
    return await getPayment(voucher, amount)
  }

  /**
   * The `getPaymentById` function takes in a `id` path parameter and returns a promise of a Payment object
   * @param {string} id - string - This is the path parameter. It's the id of the payment we want to get.
   * @returns The payment object
   */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/{id}')
  public async getPaymentById(@Path() id: string): Promise<Payment> {
    return await getPaymentById(id)
  }

  /**
   * The `createPayment` function takes in a `Payment` object and returns a promise of a Payment object
   * @param {Payment} requestBody - Payment
   * @returns A promise of a payment object
   */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ValidateErrorJSON>(400, 'Validation Failed')
  @SuccessResponse('201', 'Created')
  @Post('/')
  public async createPayment(@Body() requestBody: Payment): Promise<Payment> {
    return await createPayment(requestBody)
  }

  /**
   * The `updatePayment` function takes in a `id` path parameter and a `Payment` object and returns a promise of a Payment object
   * @param {string} id - string - This is the id of the payment we want to update.
   * @param {Payment} requestBody - This is the body of the request. It's the data that the payment is
   * sending to the server.
   * @returns The updated payment
   */
  @Put('/{id}')
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ValidateErrorJSON>(400, 'Validation Failed')
  public async updatePayment(@Path() id: string, @Body() requestBody: Payment): Promise<Payment> {
    return await updatePayment(id, requestBody)
  }

  /**
   * The `deletePayment` function takes in a `id` path parameter and returns a promise of a number object
   * @param {string} id - string - This is the path parameter. It's the id of the payment we want to
   * delete.
   * @returns The number that was deleted
   */
  @Delete('/{id}')
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  public async deletePayment(@Path() id: string): Promise<number> {
    return await deletePayment(id)
  }
}
