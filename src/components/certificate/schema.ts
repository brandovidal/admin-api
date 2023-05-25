import { z } from 'zod'
import type { TypeOf } from 'zod'
import isEmpty from 'just-is-empty'

export const registerCertificateSchema = z.object({
  body: z.object({
    url: z.string({
      required_error: 'URL is required'
    }).url({ message: 'URL is invalid' }),
    dateOfIssue: z.string({
      required_error: 'StartDate is required'
    }).datetime({ offset: true, message: 'Date of issue is invalid' }),
    status: z.boolean({
      required_error: 'Status is required',
      invalid_type_error: 'Status must be boolean'
    }).optional(),
    programId: z.string({
      required_error: 'Program ID is required'
    }).length(24, { message: 'ID must be 24 characters' }),
    studentId: z.string({
      required_error: 'Student ID is required'
    }).length(24, { message: 'Student ID must be 24 characters' })
  })
})

export const updateCertificateSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'ID is required'
    }).length(24, { message: 'ID must be 24 characters' })
  }),
  body: z.object({
    url: z.string({
      required_error: 'URL is required'
    }).url({ message: 'URL is invalid' }).optional(),
    dateOfIssue: z.string({
      required_error: 'StartDate is required'
    }).datetime({ offset: true, message: 'Date of issue is invalid' }).optional(),
    status: z.boolean({
      required_error: 'Status is required',
      invalid_type_error: 'Status must be boolean'
    }).optional(),
    programId: z.string({
      required_error: 'Program ID is required'
    }).length(24, { message: 'ID must be 24 characters' }).optional(),
    studentId: z.string({
      required_error: 'Student ID is required'
    }).length(24, { message: 'Student ID must be 24 characters' }).optional()
  })
})

export const findCertificateByIdSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'ID is required'
    }).length(24, { message: 'ID must be 24 characters' })
  })
})

export const findCertificateSchema = z.object({
  query: z.object({
    url: z.string({}).nullish(),
    dateOfIssue: z.string({}).nullish()
  }).superRefine((val, ctx) => {
    const { url, dateOfIssue } = val
    if (isEmpty(url) && isEmpty(dateOfIssue)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'URL or dateOfIssue is required',
        fatal: true
      })
    }
  })
})

export type RegisterCertificateInput = TypeOf<typeof registerCertificateSchema>['body']

export type UpdateCertificateInput = TypeOf<typeof updateCertificateSchema>['body']
