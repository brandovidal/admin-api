import { Country } from '@prisma/client'

import { createCountry, getCountries, deleteCountry, updateCountry, getCountryById, getCountry } from './repository'

import type { ForbiddenErrorJSON, InternalErrorJSON, ValidateErrorJSON } from '../../interfaces/response'
import { type CountriesResponse } from '../../interfaces/country'

import { Get, Post, Put, Delete, Path, Route, Body, SuccessResponse, Query, Response, OperationId, Tags } from 'tsoa'

@Tags('Country')
@Route('/api/countries')
export default class CountryController {
  /**
   * The `getCountries` function takes in a `name`, `iso3`, `page` and `limit` query parameter and returns a `CountriesResponse`
  * @param {string} [name] - string
  * @param {string} [iso3] - string
  * @param [page=1] - The page number of the results to return.
  * @param [limit=10] - The number of items to return per page.
  * @returns The return  is CountriesResponse.
  */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/')
  @OperationId('getCountries')
  public async getCountries (@Query() name?: string, @Query() iso3?: string, @Query() page = 1, @Query() limit = 10): Promise<CountriesResponse> {
    return await getCountries(name, iso3, page, limit)
  }

  /**
  * The `getCountry` function takes in a `name` and `iso3` query parameter and returns a `Country`
  * object
  * @param {string} [name] - string - This is the name of the country.
  * @param {string} [iso3] - The iso3 of the country to get.
  * @returns A promise of a Country object
  */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/country')
  public async getCountry (@Query() name?: string, @Query() iso3?: string): Promise<Country> {
    return await getCountry(name, iso3)
  }

  /**
   * The `getCountryById` function takes in a `id` path parameter and returns a promise of a Country object
   * @param {string} id - string - This is the path parameter. It's the id of the country we want to get.
   * @returns The country object
   */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/{id}')
  public async getCountryById (@Path() id: string): Promise<Country> {
    return await getCountryById(id)
  }

  /**
   * The `createCountry` function takes in a `Country` object and returns a promise of a Country object
   * @param {Country} requestBody - Country
   * @returns A promise of a country object
   */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ValidateErrorJSON>(400, 'Validation Failed')
  @SuccessResponse('201', 'Created')
  @Post('/')
  public async createCountry (@Body() requestBody: Country): Promise<Country> {
    return await createCountry(requestBody)
  }

  /**
   * The `updateCountry` function takes in a `id` path parameter and a `Country` object and returns a promise of a Country object
   * @param {string} id - string - This is the id of the country we want to update.
   * @param {Country} requestBody - This is the body of the request. It's the data that the country is
   * sending to the server.
   * @returns The updated country
   */
  @Put('/{id}')
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ValidateErrorJSON>(400, 'Validation Failed')
  public async updateCountry (@Path() id: string, @Body() requestBody: Country): Promise<Country> {
    return await updateCountry(id, requestBody)
  }

  /**
   * The `deleteCountry` function takes in a `id` path parameter and returns a promise of a number object
   * @param {string} id - string - This is the path parameter. It's the id of the country we want to
   * delete.
   * @returns The number that was deleted
   */
  @Delete('/{id}')
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  public async deleteCountry (@Path() id: string): Promise<number> {
    return await deleteCountry(id)
  }
}
