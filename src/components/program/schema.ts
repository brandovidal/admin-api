import { object, string, z } from 'zod'
import type { TypeOf } from 'zod'

enum RoleEnumType {
  ADMIN = 'admin',
  USER = 'user',
}

export const registerProgramSchema = object({
  body: object({
    username: string({
      required_error: 'Name is required'
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
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match'
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

export type RegisterProgramInput = Omit<TypeOf<typeof registerProgramSchema>['body'], 'passwordConfirm'>

export type UpdateProgramInput = TypeOf<typeof updateProgramSchema>['body']
