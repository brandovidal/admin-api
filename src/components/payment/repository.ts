import type { Prisma, Payment } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

import { CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'

import isEmpty from 'just-is-empty'

import { PAGE_DEFAULT, SIZE_DEFAULT, TTL_DEFAULT } from '../../constants/repository'

import { getPagination } from '../../utils/page'

import { Response } from '../../interfaces/utils/response'

const paymentCache = new CacheContainer(new MemoryStorage())

const prisma = new PrismaClient()

export const getPayments = async (voucher?: string, amount?: string, page = PAGE_DEFAULT, limit = SIZE_DEFAULT): Promise<Response<Payment>> => {
  const take = limit ?? SIZE_DEFAULT
  const skip = (page - 1) * take

  const [total, data] = await prisma.$transaction([
    prisma.payment.count(),
    prisma.payment.findMany({
      where: {
        voucher: { contains: voucher?.toString(), mode: 'insensitive' }
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

export const getPaymentById = async (paymentId: string): Promise<Payment> => {
  const cachedPaymentById = await paymentCache.getItem<Payment>('get-payment-by-id') as Payment
  const cachedPaymentId = await paymentCache.getItem<string>('get-id-payment')

  if (!isEmpty(cachedPaymentById) && cachedPaymentId === paymentId) {
    return cachedPaymentById
  }

  const payment = await prisma.payment.findFirst({
    where: {
      id: paymentId
    }
  }) as Payment

  await paymentCache.setItem('get-payment-by-id', payment, { ttl: TTL_DEFAULT })

  // params
  await paymentCache.setItem('get-id-payment', paymentId, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return payment
}

export const getPayment = async (voucher?: string, amount?: string): Promise<Payment> => {
  const cachedPayment = await paymentCache.getItem<Payment>('get-only-payment') as Payment

  // params
  const cachedName = await paymentCache.getItem<number>('get-only-voucher')
  const cachedCode = await paymentCache.getItem<number>('get-only-amount')

  if (!isEmpty(cachedPayment) && cachedName === voucher && cachedCode === amount) {
    return cachedPayment
  }

  const payment = await prisma.payment.findFirst({
    where: {
      voucher: { contains: voucher, mode: 'insensitive' }
    }
  }) as Payment

  await paymentCache.setItem('get-only-payment', payment, { ttl: TTL_DEFAULT })

  // params
  await paymentCache.setItem('get-only-voucher', voucher, { ttl: TTL_DEFAULT })
  await paymentCache.setItem('get-only-amount', amount, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return payment
}

export const getUniquePayment = async (where: Prisma.PaymentWhereUniqueInput, select?: Prisma.PaymentSelect): Promise<Payment> => {
  const payment = (await prisma.payment.findUnique({
    where,
    select
  })) as Payment

  void prisma.$disconnect()
  return payment
}

export const createPayment = async (paymentInput: Prisma.PaymentCreateInput): Promise<Payment> => {
  const payment = await prisma.payment.create({ data: paymentInput })
  void prisma.$disconnect()
  return payment
}

export const updatePayment = async (paymentId: string, paymentInput: Payment): Promise<Payment> => {
  const payment = await prisma.payment.update({
    where: {
      id: paymentId
    },
    data: paymentInput
  })
  void prisma.$disconnect()
  return payment
}

export const deletePayment = async (paymentId: string): Promise<number> => {
  const payment = await prisma.payment.deleteMany({
    where: {
      id: {
        in: [paymentId]
      }
    }
  })
  void prisma.$disconnect()
  return payment.count
}
