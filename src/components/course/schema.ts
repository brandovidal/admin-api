import { number, object, string, z } from 'zod'
import type { TypeOf } from 'zod'
import isEmpty from 'just-is-empty'

enum RoleEnumType {
  ADMIN = 'admin',
  USER = 'user',
}

export const registerCourseSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required'
    }),
    code: string({
      required_error: 'Code is required'
    }),
    amount: number({
      required_error: 'Amount is required'
    }),
    discount: number({
      required_error: 'Discount is required'
    }),
    total: number({
      required_error: 'Total is required'
    }),
    courseId: string({
      required_error: 'Course ID is required'
    }).length(24),
  })
})

export const updateCourseSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required'
    }),
    code: string({
      required_error: 'Code is required'
    }),
    amount: number({
      required_error: 'Amount is required'
    }),
    discount: number({
      required_error: 'Discount is required'
    }),
    total: number({
      required_error: 'Total is required'
    }),
    courseId: string({
      required_error: 'Course ID is required'
    }).length(24),
  })
})

export const findCourseByIdSchema = object({
  params: object({
    id: string({
      required_error: 'ID is required'
    }),
  })
})

export const findCourseSchema = object({
  query: object({
    name: string({}).nullish(),
    code: string({}).nullish()
  }).superRefine((val, ctx) => {
    const { name, code } = val
    if (isEmpty(name) && isEmpty(code)) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Name or code is required',
        fatal: true
      })
    }
  })
})

export type RegisterCourseInput = TypeOf<typeof registerCourseSchema>['body']

export type UpdateCourseInput = TypeOf<typeof updateCourseSchema>['body']
