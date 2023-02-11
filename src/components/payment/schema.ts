import { z } from 'zod'
import type { TypeOf } from 'zod'
import isEmpty from 'just-is-empty'

export const registerPaymentSchema = z.object({
  body: z.object({
    voucher: z.string({
      required_error: 'voucher is required'
    }),
    amount: z.number({
      required_error: 'amount is required'
    }).gte(0, { message: 'amount minimun is zero' }),

    paymentMethod: z.string({
      required_error: 'paymentMethod is required'
    }),
    paymentDate: z.string({
      required_error: 'paymentDate is required'
    }).datetime({ offset: true }),
    paymentCondition: z.string({
      required_error: 'paymentCondition is required'
    }).optional(),
    placeOfPayment: z.string({
      required_error: 'placeOfPayment is required'
    }).optional(),
    observations: z.string({
      required_error: 'observations is required'
    }).optional(),

    enrollmentId: z.string({
      required_error: 'enrollmentId is required'
    }).length(24, { message: 'enrollmentId must be 24 characters' }),
    studentId: z.string({
      required_error: 'studentId is required'
    }).length(24, { message: 'studentId must be 24 characters' }),
  })
})

export const updatePaymentSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'ID is required'
    }).length(24, { message: 'ID must be 24 characters' })
  }),
  body: z.object({
    voucher: z.string({
      required_error: 'voucher is required'
    }).optional(),
    amount: z.number({
      required_error: 'amount is required'
    }).gte(0, { message: 'amount minimun is zero' }).optional(),

    paymentMethod: z.string({
      required_error: 'paymentMethod is required'
    }).optional(),
    paymentDate: z.string({
      required_error: 'paymentDate is required'
    }).datetime({ offset: true }).optional(),
    paymentCondition: z.string({
      required_error: 'paymentCondition is required'
    }).optional(),
    placeOfPayment: z.string({
      required_error: 'placeOfPayment is required'
    }).optional(),
    observations: z.string({
      required_error: 'observations is required'
    }).optional(),

    enrollmentId: z.string({
      required_error: 'enrollmentId is required'
    }).length(24, { message: 'enrollmentId must be 24 characters' }).optional(),
    studentId: z.string({
      required_error: 'studentId is required'
    }).length(24, { message: 'studentId must be 24 characters' }).optional(),
  })
})

export const findPaymentByIdSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'ID is required'
    }).length(24, { message: 'ID must be 24 characters' }),
  })
})

export const findPaymentSchema = z.object({
  query: z.object({
    voucher: z.string({}).nullish(),
    amount: z.string({}).nullish()
  }).superRefine((val, ctx) => {
    const { voucher, amount } = val
    if (isEmpty(voucher) && isEmpty(amount)) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'voucher or amount is required',
        fatal: true
      })
    }
  })
})

export type RegisterPaymentInput = TypeOf<typeof registerPaymentSchema>['body']

export type UpdatePaymentInput = TypeOf<typeof updatePaymentSchema>['body']
