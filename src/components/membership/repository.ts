import type { Prisma, Membership } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

import { CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'

import isEmpty from 'just-is-empty'

import { PAGE_DEFAULT, SIZE_DEFAULT, TTL_DEFAULT } from '../../constants/repository'

import { getPagination } from '../../utils/page'
import { Response } from '../../interfaces/utils/response'

export const excludedFields = ['password', 'verified', 'verificationCode']

const membershipCache = new CacheContainer(new MemoryStorage())

const prisma = new PrismaClient()

export const getMemberships = async (startDate?: string, endDate?: string, page = PAGE_DEFAULT, limit = SIZE_DEFAULT): Promise<Response<Membership>> => {
  const take = limit ?? SIZE_DEFAULT
  const skip = (page - 1) * take

  const [total, data] = await prisma.$transaction([
    prisma.membership.count(),
    prisma.membership.findMany({
      where: {
        startDate,
        endDate
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

export const getMembershipById = async (membershipId: string): Promise<Membership> => {
  const cachedMembershipById = await membershipCache.getItem<Membership>('get-membership-by-id') as Membership
  const cachedMembershipId = await membershipCache.getItem<string>('get-id-membership')

  if (!isEmpty(cachedMembershipById) && cachedMembershipId === membershipId) {
    return cachedMembershipById
  }

  const membership = await prisma.membership.findFirst({
    where: {
      id: membershipId
    }
  }) as Membership

  await membershipCache.setItem('get-membership-by-id', membership, { ttl: TTL_DEFAULT })

  // params
  await membershipCache.setItem('get-id-membership', membershipId, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return membership
}

export const getMembership = async (startDate?: string, endDate?: string): Promise<Membership> => {
  const cachedMembership = await membershipCache.getItem<Membership>('get-only-membership') as Membership

  // params
  const cachedName = await membershipCache.getItem<number>('get-only-startDate')
  const cachedCode = await membershipCache.getItem<number>('get-only-endDate')

  if (!isEmpty(cachedMembership) && cachedName === startDate && cachedCode === endDate) {
    return cachedMembership
  }

  const membership = await prisma.membership.findFirst({
    where: {
      startDate,
      endDate
    }
  }) as Membership

  await membershipCache.setItem('get-only-membership', membership, { ttl: TTL_DEFAULT })

  // params
  await membershipCache.setItem('get-only-startDate', startDate, { ttl: TTL_DEFAULT })
  await membershipCache.setItem('get-only-endDate', endDate, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return membership
}

export const getUniqueMembership = async (where: Prisma.MembershipWhereUniqueInput, select?: Prisma.MembershipSelect): Promise<Membership> => {
  const membership = (await prisma.membership.findUnique({
    where,
    select
  })) as Membership

  void prisma.$disconnect()
  return membership
}

export const createMembership = async (membershipInput: Prisma.MembershipCreateInput): Promise<Membership> => {
  const membership = await prisma.membership.create({ data: membershipInput })
  void prisma.$disconnect()
  return membership
}

export const updateMembership = async (membershipId: string, membershipInput: Membership): Promise<Membership> => {
  const membership = await prisma.membership.update({
    where: {
      id: membershipId
    },
    data: membershipInput
  })
  void prisma.$disconnect()
  return membership
}

export const deleteMembership = async (membershipId: string): Promise<number> => {
  const membership = await prisma.membership.deleteMany({
    where: {
      id: {
        in: [membershipId]
      }
    }
  })
  void prisma.$disconnect()
  return membership.count
}
