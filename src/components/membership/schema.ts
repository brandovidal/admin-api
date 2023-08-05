import { object, string, z } from 'zod'
import type { TypeOf } from 'zod'
import isEmpty from 'just-is-empty'

export const registerMembershipSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required'
    }),
    code: string({
      required_error: 'Code is required'
    }),
    startDate: string({
      required_error: 'StartDate is required'
    }).datetime({ offset: true }).optional(),
    endDate: string({
      required_error: 'EndDte is required'
    }).datetime({ offset: true }).optional(),
    programId: string({
      required_error: 'Program ID is required'
    }).length(24).optional()
  })
})

export const updateMembershipSchema = object({
  params: object({
    id: string({
      required_error: 'ID is required'
    }).length(24, { message: 'ID must be 24 characters' })
  }),
  body: object({
    name: string({
      required_error: 'Name is required'
    }).optional(),
    code: string({
      required_error: 'Code is required'
    }).optional(),
    startDate: string({
      required_error: 'StartDate is required'
    }).datetime({ offset: true }).optional(),
    endDate: string({
      required_error: 'EndDte is required'
    }).datetime({ offset: true }).optional(),
    programId: string({
      required_error: 'Program ID is required'
    }).length(24, { message: 'ID must be 24 characters' }).optional()
  })
})

export const findMembershipByIdSchema = object({
  params: object({
    id: string({
      required_error: 'ID is required'
    }).length(24, { message: 'ID must be 24 characters' })
  })
})

export const findMembershipSchema = object({
  query: object({
    name: string({}).nullish(),
    code: string({}).nullish()
  }).superRefine((val, ctx) => {
    const { name, code } = val
    if (isEmpty(name) && isEmpty(code)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Name or code is required',
        fatal: true
      })
    }
  })
})

export type RegisterMembershipInput = TypeOf<typeof registerMembershipSchema>['body']

export type UpdateMembershipInput = TypeOf<typeof updateMembershipSchema>['body']
