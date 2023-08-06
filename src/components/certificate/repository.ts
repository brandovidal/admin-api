import type { Prisma, Certificate } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

import { CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'

import isEmpty from 'just-is-empty'

import { PAGE_DEFAULT, SIZE_DEFAULT, TTL_DEFAULT } from '../../constants/repository'

import { getPagination } from '../../utils/page'
import { Response } from '../../interfaces/utils/response'

const certificateCache = new CacheContainer(new MemoryStorage())

const prisma = new PrismaClient()

export const getCertificates = async (dateOfIssue?: string, url?: string, page = PAGE_DEFAULT, limit = SIZE_DEFAULT): Promise<Response<Certificate>> => {
  const take = limit ?? SIZE_DEFAULT
  const skip = (page - 1) * take

  const [total, data] = await prisma.$transaction([
    prisma.certificate.count(),
    prisma.certificate.findMany({
      where: {
        dateOfIssue,
        url
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

export const getCertificateById = async (certificateId: string): Promise<Certificate> => {
  const cachedCertificateById = await certificateCache.getItem<Certificate>('get-certificate-by-id') as Certificate
  const cachedCertificateId = await certificateCache.getItem<string>('get-id-certificate')

  if (!isEmpty(cachedCertificateById) && cachedCertificateId === certificateId) {
    return cachedCertificateById
  }

  const certificate = await prisma.certificate.findFirst({
    where: {
      id: certificateId
    }
  }) as Certificate

  await certificateCache.setItem('get-certificate-by-id', certificate, { ttl: TTL_DEFAULT })

  // params
  await certificateCache.setItem('get-id-certificate', certificateId, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return certificate
}

export const getCertificate = async (dateOfIssue?: string, url?: string): Promise<Certificate> => {
  const cachedCertificate = await certificateCache.getItem<Certificate>('get-only-certificate') as Certificate

  // params
  const cachedName = await certificateCache.getItem<number>('get-only-dateOfIssue')
  const cachedCode = await certificateCache.getItem<number>('get-only-url')

  if (!isEmpty(cachedCertificate) && cachedName === dateOfIssue && cachedCode === url) {
    return cachedCertificate
  }

  const certificate = await prisma.certificate.findFirst({
    where: {
      dateOfIssue,
      url
    }
  }) as Certificate

  await certificateCache.setItem('get-only-certificate', certificate, { ttl: TTL_DEFAULT })

  // params
  await certificateCache.setItem('get-only-dateOfIssue', dateOfIssue, { ttl: TTL_DEFAULT })
  await certificateCache.setItem('get-only-url', url, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return certificate
}

export const getUniqueCertificate = async (where: Prisma.CertificateWhereUniqueInput, select?: Prisma.CertificateSelect): Promise<Certificate> => {
  const certificate = (await prisma.certificate.findUnique({
    where,
    select
  })) as Certificate

  void prisma.$disconnect()
  return certificate
}

export const createCertificate = async (certificateInput: Prisma.CertificateCreateInput): Promise<Certificate> => {
  const certificate = await prisma.certificate.create({ data: certificateInput })
  void prisma.$disconnect()
  return certificate
}

export const updateCertificate = async (certificateId: string, certificateInput: Certificate): Promise<Certificate> => {
  const certificate = await prisma.certificate.update({
    where: {
      id: certificateId
    },
    data: certificateInput
  })
  void prisma.$disconnect()
  return certificate
}

export const deleteCertificate = async (certificateId: string): Promise<number> => {
  const certificate = await prisma.certificate.deleteMany({
    where: {
      id: {
        in: [certificateId]
      }
    }
  })
  void prisma.$disconnect()
  return certificate.count
}
