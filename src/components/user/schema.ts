import { object, string, z } from 'zod'
import type { TypeOf } from 'zod'

import isEmpty from 'just-is-empty'

enum RoleEnumType {
  ADMIN = 'admin',
  USER = 'user'
}

export const registerUserSchema = object({
  body: object({
    username: string({
      required_error: 'Username is required'
    }),
    name: string({
      required_error: 'Name is required'
    }),
    email: string({
      required_error: 'Email address is required'
    }).email('Invalid email address'),
    password: string({
      required_error: 'Password is required'
    })
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
    passwordConfirm: string({
      required_error: 'Please confirm your password'
    }),
    role: z.optional(z.nativeEnum(RoleEnumType))
  }).refine(data => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match'
  })
})

export const updateUserSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required'
    }),
    email: string({
      required_error: 'Email address is required'
    }).email('Invalid email address'),
    password: string({
      required_error: 'Password is required'
    })
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
    passwordConfirm: string({
      required_error: 'Please confirm your password'
    }),
    role: z.optional(z.nativeEnum(RoleEnumType))
  })
    .partial()
    .refine(data => data.password === data.passwordConfirm, {
      path: ['passwordConfirm'],
      message: 'Passwords do not match'
    })
})

export const findUserByIdSchema = object({
  params: object({
    id: string({
      required_error: 'ID is required'
    })
  })
})

export const findUserSchema = object({
  query: object({
    name: string({}).nullish(),
    email: string({}).nullish()
  }).superRefine((val, ctx) => {
    const { name, email } = val
    if (isEmpty(name) && isEmpty(email)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Name or email is required',
        fatal: true
      })
    }
  })
})

export type RegisterUserInput = Omit<TypeOf<typeof registerUserSchema>['body'], 'passwordConfirm'>

export type UpdateUserInput = TypeOf<typeof updateUserSchema>['body']
