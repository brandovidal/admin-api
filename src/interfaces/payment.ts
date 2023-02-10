import { type Payment } from '@prisma/client'

export interface PaymentsResponse {
  count?: number
  total?: number
  payments: Payment[]
}