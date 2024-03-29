import { number, object, string, z } from 'zod'
import type { TypeOf } from 'zod'
import isEmpty from 'just-is-empty'

export const registerProgramSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required'
    }),
    code: string({
      required_error: 'Code is required'
    }),
    amount: number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number'
    }).nullish(),
    discount: number({
      required_error: 'Discount is required',
      invalid_type_error: 'Discount must be a number'
    }).nullish(),
    total: number({
      required_error: 'Total is required',
      invalid_type_error: 'Total must be a number'
    }).nullish(),
    courseId: string({
      required_error: 'Course ID is required'
    }).length(24).nullish()
  })
})

export const updateProgramSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required'
    }),
    code: string({
      required_error: 'Code is required'
    }),
    amount: number({
      required_error: 'Amount is required'
    }).nullish(),
    discount: number({
      required_error: 'Discount is required'
    }).nullish(),
    total: number({
      required_error: 'Total is required'
    }).nullish(),
    courseId: string({
      required_error: 'Course ID is required'
    }).length(24).nullish()
  })
})

export const findProgramByIdSchema = object({
  params: object({
    id: string({
      required_error: 'ID is required'
    })
  })
})

export const findProgramSchema = object({
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

export type RegisterProgramInput = TypeOf<typeof registerProgramSchema>['body']

export type UpdateProgramInput = TypeOf<typeof updateProgramSchema>['body']
