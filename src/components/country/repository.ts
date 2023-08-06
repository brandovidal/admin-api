import type { Prisma, Country } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

import { CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'

import isEmpty from 'just-is-empty'

import { PAGE_DEFAULT, SIZE_DEFAULT, TTL_DEFAULT } from '../../constants/repository'

import { getPagination } from '../../utils/page'
import { Response } from '../../interfaces/utils/response'

const countryCache = new CacheContainer(new MemoryStorage())

const prisma = new PrismaClient()

export const getCountries = async (name?: string, iso3?: string, page = PAGE_DEFAULT, limit = SIZE_DEFAULT): Promise<Response<Country>> => {
  const take = limit ?? SIZE_DEFAULT
  const skip = (page - 1) * take

  const [total, data] = await prisma.$transaction([
    prisma.country.count(),
    prisma.country.findMany({
      where: {
        name: { contains: name?.toString(), mode: 'insensitive' }
      },
      take,
      skip,
      orderBy: {
        updatedAt: 'asc'
      }
    })
  ])
  void prisma.$disconnect()
  
  const meta = getPagination(page, total, take)
  return { data, meta }
}

export const getCountryById = async (countryId: string): Promise<Country> => {
  const cachedCountryById = await countryCache.getItem<Country>('get-country-by-id') as Country
  const cachedCountryId = await countryCache.getItem<string>('get-id-country')

  if (!isEmpty(cachedCountryById) && cachedCountryId === countryId) {
    return cachedCountryById
  }

  const country = await prisma.country.findFirst({
    where: {
      id: countryId
    }
  }) as Country

  await countryCache.setItem('get-country-by-id', country, { ttl: TTL_DEFAULT })

  // params
  await countryCache.setItem('get-id-country', countryId, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return country
}

export const getCountry = async (name?: string, iso3?: string): Promise<Country> => {
  const cachedCountry = await countryCache.getItem<Country>('get-only-country') as Country

  // params
  const cachedName = await countryCache.getItem<number>('get-only-name')
  const cachedIso3 = await countryCache.getItem<number>('get-only-iso3')

  if (!isEmpty(cachedCountry) && cachedName === name && cachedIso3 === iso3) {
    return cachedCountry
  }

  const country = await prisma.country.findFirst({
    where: {
      name: { contains: name, mode: 'insensitive' }
    }
  }) as Country

  await countryCache.setItem('get-only-country', country, { ttl: TTL_DEFAULT })

  // params
  await countryCache.setItem('get-only-name', name, { ttl: TTL_DEFAULT })
  await countryCache.setItem('get-only-iso3', iso3, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return country
}

export const getUniqueCountry = async (where: Prisma.CountryWhereUniqueInput, select?: Prisma.CountrySelect): Promise<Country> => {
  const country = (await prisma.country.findUnique({
    where,
    select
  })) as Country

  void prisma.$disconnect()
  return country
}

export const createCountry = async (countryInput: Prisma.CountryCreateInput): Promise<Country> => {
  const country = await prisma.country.create({ data: countryInput })
  void prisma.$disconnect()
  return country
}

export const updateCountry = async (countryId: string, countryInput: Country): Promise<Country> => {
  const country = await prisma.country.update({
    where: {
      id: countryId
    },
    data: countryInput
  })
  void prisma.$disconnect()
  return country
}

export const deleteCountry = async (countryId: string): Promise<number> => {
  const country = await prisma.country.deleteMany({
    where: {
      id: {
        in: [countryId]
      }
    }
  })
  void prisma.$disconnect()
  return country.count
}
