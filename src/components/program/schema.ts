import { number, object, string, z } from 'zod'
import type { TypeOf } from 'zod'
import isEmpty from 'just-is-empty'

enum RoleEnumType {
  ADMIN = 'admin',
  USER = 'user',
}

export const registerProgramSchema = object({
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

export const updateProgramSchema = object({
  body: object({
    name: string({}),
    email: string({}).email('Invalid email address'),
    password: string({})
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
    passwordConfirm: string({}),
    role: z.optional(z.nativeEnum(RoleEnumType))
  })
    .partial()
    .refine((data) => data.password === data.passwordConfirm, {
      path: ['passwordConfirm'],
      message: 'Passwords do not match'
    })
})

export const findProgramByIdSchema = object({
  params: object({
    id: string({
      required_error: 'ID is required'
    }),
  })
})

export const findProgramSchema = object({
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

export type RegisterProgramInput = Omit<TypeOf<typeof registerProgramSchema>['body'], 'passwordConfirm'>

export type UpdateProgramInput = TypeOf<typeof updateProgramSchema>['body']
