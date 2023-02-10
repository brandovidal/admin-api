import type { Prisma, Payment } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

import { CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'

import type { PaymentsResponse } from '../../interfaces/payment'

import { PAGE_DEFAULT, SIZE_DEFAULT, TTL_DEFAULT } from '../../constants/repository'

import isEmpty from 'just-is-empty'

export const excludedFields = ['password', 'verified', 'verificationCode']

const paymentCache = new CacheContainer(new MemoryStorage())

const prisma = new PrismaClient()

export const getPayments = async (voucher?: string, amount?: string, page = PAGE_DEFAULT, size = SIZE_DEFAULT): Promise<PaymentsResponse> => {
  const take = size ?? SIZE_DEFAULT
  const skip = (page - 1) * take

  const cachedPayments = await paymentCache.getItem<Payment[]>('get-payments') ?? []
  const cachedTotalPayments = await paymentCache.getItem<number>('total-payments') ?? 0

  // params
  const cachedName = await paymentCache.getItem<number>('get-voucher-payments')
  const cachedCode = await paymentCache.getItem<number>('get-amount-payments')
  const cachedSize = await paymentCache.getItem<number>('get-size-payments')
  const cachedPage = await paymentCache.getItem<number>('get-page-payments')

  if (!isEmpty(cachedPayments) && cachedName === voucher && cachedCode === amount && cachedSize === size && cachedPage === page) {
    return { count: cachedPayments.length, total: cachedTotalPayments, payments: cachedPayments }
  }

  const [total, payments] = await prisma.$transaction([
    prisma.payment.count(),
    prisma.payment.findMany({
      where: {
        voucher: { contains: voucher?.toString(), mode: 'insensitive' },
      },
      take,
      skip,
      orderBy: {
        updatedAt: 'asc'
      }
    })
  ])

  const count = payments.length

  await paymentCache.setItem('get-payments', payments, { ttl: TTL_DEFAULT })
  await paymentCache.setItem('total-payments', total, { ttl: TTL_DEFAULT })

  // params
  await paymentCache.setItem('get-voucher-payments', voucher, { ttl: TTL_DEFAULT })
  await paymentCache.setItem('get-amount-payments', amount, { ttl: TTL_DEFAULT })
  await paymentCache.setItem('get-size-payments', size, { ttl: TTL_DEFAULT })
  await paymentCache.setItem('get-page-payments', page, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return { count, total, payments }
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
      voucher: { contains: voucher, mode: 'insensitive' },
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
    },
  })
  void prisma.$disconnect()
  return payment.count
}
