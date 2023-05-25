import { z } from 'zod'
import type { TypeOf } from 'zod'
import isEmpty from 'just-is-empty'

export const registerEnrollmentSchema = z.object({
  body: z.object({
    startDate: z.string({
      required_error: 'startDate is required'
    }).datetime({ offset: true }).optional(),
    endDate: z.string({
      required_error: 'endDate is required'
    }).datetime({ offset: true }).optional(),

    faceToFaceModality: z.boolean({
      required_error: 'faceToFaceModality is required'
    }).optional(),
    semiFaceToFaceModality: z.boolean({
      required_error: 'semiFaceToFaceModality is required'
    }).optional(),
    virtualModality: z.boolean({
      required_error: 'virtualModality is required'
    }).optional(),

    enableMarketingAds: z.boolean({
      required_error: 'virtualMenableMarketingAdsodality is required'
    }).optional(),
    marketingAds: z.string().array().nonempty({
      message: 'marketingAds is required'
    }).optional(),
    marketingMedia: z.boolean({
      required_error: 'marketingMedia is required'
    }).optional(),
    marketingEmail: z.boolean({
      required_error: 'marketingEmail is required'
    }).optional(),

    amount: z.number({
      required_error: 'amount is required',
      invalid_type_error: 'amount is not a number'
    }).gte(0, { message: 'amount is 0 minimun' }).optional(),
    discount: z.number({
      required_error: 'discount is required',
      invalid_type_error: 'discount is not a number'
    }).gte(0, { message: 'discount is 0 minimun' }).optional(),
    total: z.number({
      required_error: 'total is required',
      invalid_type_error: 'total is not a number'
    }).gte(0, { message: 'total is 0 minimun' }).optional(),

    studentId: z.string({
      required_error: 'student ID is required'
    }).length(24).optional(),
    programId: z.string({
      required_error: 'program ID is required'
    }).length(24).optional()
  })
})

export const updateEnrollmentSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'ID is required'
    }).length(24, { message: 'ID must be 24 characters' })
  }),
  body: z.object({
    startDate: z.string({
      required_error: 'startDate is required'
    }).datetime({ offset: true }).optional(),
    endDate: z.string({
      required_error: 'endDate is required'
    }).datetime({ offset: true }).optional(),

    faceToFaceModality: z.boolean({
      required_error: 'faceToFaceModality is required'
    }).optional(),
    semiFaceToFaceModality: z.boolean({
      required_error: 'semiFaceToFaceModality is required'
    }).optional(),
    virtualModality: z.boolean({
      required_error: 'virtualModality is required'
    }).optional(),

    enableMarketingAds: z.boolean({
      required_error: 'virtualMenableMarketingAdsodality is required'
    }).optional(),
    marketingAds: z.string().array().nonempty({
      message: 'marketingAds is required'
    }).optional(),
    marketingMedia: z.boolean({
      required_error: 'marketingMedia is required'
    }).optional(),
    marketingEmail: z.boolean({
      required_error: 'marketingEmail is required'
    }).optional(),

    amount: z.number({
      required_error: 'amount is required',
      invalid_type_error: 'amount is not a number'
    }).gte(0, { message: 'amount is 0 minimun' }).optional(),
    discount: z.number({
      required_error: 'discount is required',
      invalid_type_error: 'discount is not a number'
    }).gte(0, { message: 'discount is 0 minimun' }).optional(),
    total: z.number({
      required_error: 'total is required',
      invalid_type_error: 'total is not a number'
    }).gte(0, { message: 'total is 0 minimun' }).optional(),

    studentId: z.string({
      required_error: 'student ID is required'
    }).length(24).optional(),
    programId: z.string({
      required_error: 'program ID is required'
    }).length(24).optional()
  })
})

export const findEnrollmentByIdSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'ID is required'
    }).length(24, { message: 'ID must be 24 characters' })
  })
})

export const findEnrollmentSchema = z.object({
  query: z.object({
    startDate: z.string({}).nullish(),
    endDate: z.string({}).nullish()
  }).superRefine((val, ctx) => {
    const { startDate, endDate } = val
    if (isEmpty(startDate) && isEmpty(endDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'startDate or endDate is required',
        fatal: true
      })
    }
  })
})

export type RegisterEnrollmentInput = TypeOf<typeof registerEnrollmentSchema>['body']

export type UpdateEnrollmentInput = TypeOf<typeof updateEnrollmentSchema>['body']
