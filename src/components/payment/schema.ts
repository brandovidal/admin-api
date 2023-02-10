import { z } from 'zod'
import type { TypeOf } from 'zod'
import isEmpty from 'just-is-empty'

export const registerPaymentSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required'
    }),
    lastname: z.string({
      required_error: 'Lastname is required'
    }),
    birthday: z.string({
      required_error: 'Birthday is required'
    }).datetime({ offset: true }).optional(),
    dni: z.number({
      required_error: 'DNI is required'
    }),
    email: z.string({
      required_error: 'Email is required'
    }),

    amount: z.number({
      required_error: 'amount is required'
    }).gte(0, { message: 'amount minimun is zero' }),
    businessName: z.string({
      required_error: 'BusinessName is required'
    }).optional(),
    address: z.string({
      required_error: 'Address is required'
    }).optional(),

    country: z.string({
      required_error: 'Country is required'
    }).optional(),
    phone: z.number({
      required_error: 'Phone is required'
    }).optional(),
    phoneWithFormat: z.number({
      required_error: 'Phone With Format is required'
    }).optional(),
    ladline: z.number({
      required_error: 'Ladline is required'
    }).optional(),
    ladlineWithFormat: z.number({
      required_error: 'Ladline With Format is required'
    }).optional(),

    postgradoTraining: z.boolean({
      required_error: 'postgradoTraining is required'
    }).optional(),
    qualifiedTraining: z.boolean({
      required_error: 'qualifiedTraining is required'
    }).optional(),
    highSchoolTraining: z.boolean({
      required_error: 'highSchoolTraining is required'
    }).optional(),
    paymentTraining: z.boolean({
      required_error: 'paymentTraining is required'
    }).optional(),

    studyCenter: z.string({
      required_error: 'studyCenter is required'
    }).optional(),
    workplace: z.string({
      required_error: 'workplace is required'
    }).optional(),
    workPosition: z.string({
      required_error: 'workPosition is required'
    }).optional(),
    workAddress: z.string({
      required_error: 'workAddress is required'
    }).optional(),

    enrollmentId: z.string({
      required_error: 'enrollment ID is required'
    }).length(24).optional(),
    certificateId: z.string({
      required_error: 'certificate ID is required'
    }).length(24).optional(),
    membershipId: z.string({
      required_error: 'membership ID is required'
    }).length(24).optional(),
    paymentId: z.string({
      required_error: 'payment ID is required'
    }).length(24).optional(),
  })
})

export const updatePaymentSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'ID is required'
    }).length(24, { message: 'ID must be 24 characters' })
  }),
  body: z.object({
    name: z.string({
      required_error: 'Name is required'
    }).optional(),
    lastname: z.string({
      required_error: 'Lastname is required'
    }).optional(),
    birthday: z.string({
      required_error: 'Birthday is required'
    }).datetime({ offset: true }).optional(),
    dni: z.number({
      required_error: 'DNI is required'
    }).min(10_000_000).max(99_999_999).optional(),
    email: z.string({
      required_error: 'Email is required'
    }).email({ message: 'Email is not valid' }).optional(),

    ruc: z.number({
      required_error: 'Ruc is required'
    }).optional(),
    businessName: z.string({
      required_error: 'BusinessName is required'
    }).optional(),
    address: z.string({
      required_error: 'Address is required'
    }).optional(),

    country: z.string({
      required_error: 'Country is required'
    }).optional(),
    phone: z.number({
      required_error: 'Phone is required'
    }).optional(),
    phoneWithFormat: z.number({
      required_error: 'Phone With Format is required'
    }).optional(),
    ladline: z.number({
      required_error: 'Ladline is required'
    }).optional(),
    ladlineWithFormat: z.number({
      required_error: 'Ladline With Format is required'
    }).optional(),

    postgradoTraining: z.boolean({
      required_error: 'postgradoTraining is required'
    }).optional(),
    qualifiedTraining: z.boolean({
      required_error: 'qualifiedTraining is required'
    }).optional(),
    highSchoolTraining: z.boolean({
      required_error: 'highSchoolTraining is required'
    }).optional(),
    paymentTraining: z.boolean({
      required_error: 'paymentTraining is required'
    }).optional(),

    studyCenter: z.string({
      required_error: 'studyCenter is required'
    }).optional(),
    workplace: z.string({
      required_error: 'workplace is required'
    }).optional(),
    workPosition: z.string({
      required_error: 'workPosition is required'
    }).optional(),
    workAddress: z.string({
      required_error: 'workAddress is required'
    }).optional(),

    enrollmentId: z.string({
      required_error: 'enrollment ID is required'
    }).length(24).optional(),
    certificateId: z.string({
      required_error: 'certificate ID is required'
    }).length(24).optional(),
    membershipId: z.string({
      required_error: 'membership ID is required'
    }).length(24).optional(),
    paymentId: z.string({
      required_error: 'payment ID is required'
    }).length(24).optional(),
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
    name: z.string({}).nullish(),
    dni: z.string({}).nullish()
  }).superRefine((val, ctx) => {
    const { name, dni } = val
    if (isEmpty(name) && isEmpty(dni)) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Name or dni is required',
        fatal: true
      })
    }
  })
})

export type RegisterPaymentInput = TypeOf<typeof registerPaymentSchema>['body']

export type UpdatePaymentInput = TypeOf<typeof updatePaymentSchema>['body']
