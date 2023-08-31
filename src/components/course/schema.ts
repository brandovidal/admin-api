import { number, object, string, z } from 'zod'
import type { TypeOf } from 'zod'
import isEmpty from 'just-is-empty'

export const registerCourseSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required'
    }),
    code: string({
      required_error: 'Code is required'
    }),
    programId: string({
      required_error: 'Program ID is required'
    }).length(24).nullish()
  })
})

export const updateCourseSchema = object({
  params: object({
    id: string({
      required_error: 'ID is required'
    }).length(24, { message: 'ID must be 24 characters' })
  }),
  body: object({
    name: string({
      required_error: 'Name is required'
    }).nullish(),
    code: string({
      required_error: 'Code is required'
    }).nullish(),
    programId: string({
      required_error: 'Program ID is required'
    }).length(24, { message: 'ID must be 24 characters' }).nullish()
  })
})

export const findCourseByIdSchema = object({
  params: object({
    id: string({
      required_error: 'ID is required'
    }).length(24, { message: 'ID must be 24 characters' })
  })
})

export const findCourseSchema = object({
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

export type RegisterCourseInput = TypeOf<typeof registerCourseSchema>['body']

export type UpdateCourseInput = TypeOf<typeof updateCourseSchema>['body']
