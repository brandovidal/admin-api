import { type Country } from '@prisma/client'

export interface CountriesResponse {
  count?: number
  total?: number
  countries: Country[]
}
