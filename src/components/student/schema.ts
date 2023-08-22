import { z } from 'zod'
import type { TypeOf } from 'zod'
import isEmpty from 'just-is-empty'

export const registerStudentSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required'
    }),
    lastname: z.string({
      required_error: 'Lastname is required'
    }),
    birthday: z
      .string({
        required_error: 'Birthday is required'
      })
      .datetime({ offset: true })
      .nullish(),
    dni: z.number({
      required_error: 'DNI is required'
    }),
    email: z
      .string({
        required_error: 'Email is required'
      })
      .email({ message: 'Email is not valid' }),
    ruc: z
      .number({
        required_error: 'Ruc is required'
      })
      .nullish(),
    businessName: z
      .string({
        required_error: 'BusinessName is required'
      })
      .nullish(),
    address: z
      .string({
        required_error: 'Address is required'
      })
      .nullish(),
    country: z
      .string({
        required_error: 'Country is required'
      })
      .nullish(),
    phoneCode: z
      .string({
        required_error: 'Country is required'
      })
      .nullish(),
    phone: z
      .number({
        required_error: 'Phone is required'
      })
      .optional(),
    phoneWithFormat: z
      .string({
        required_error: 'Phone With Format is required'
      })
      .optional(),
    ladline: z
      .number({
        required_error: 'Ladline is required'
      })
      .nullish(),
    ladlineWithFormat: z
      .number({
        required_error: 'Ladline With Format is required'
      })
      .nullish(),
    postgraduateTraining: z
      .boolean({
        required_error: 'postgraduateTraining is required'
      })
      .nullish(),
    graduateTraining: z
      .boolean({
        required_error: 'graduateTraining is required'
      })
      .nullish(),
    bachelorTraining: z
      .boolean({
        required_error: 'bachelorTraining is required'
      })
      .nullish(),
    studentTraining: z
      .boolean({
        required_error: 'studentTraining is required'
      })
      .nullish(),

    studyCenter: z
      .string({
        required_error: 'studyCenter is required'
      })
      .nullish(),
    workplace: z
      .string({
        required_error: 'workplace is required'
      })
      .nullish(),
    workPosition: z
      .string({
        required_error: 'workPosition is required'
      })
      .nullish(),
    workAddress: z
      .string({
        required_error: 'workAddress is required'
      })
      .nullish(),
    status: z
      .boolean({
        required_error: 'status is required'
      }),
    enrollmentId: z
      .string({
        required_error: 'enrollment ID is required'
      })
      .length(24)
      .nullish(),
    certificateId: z
      .string({
        required_error: 'certificate ID is required'
      })
      .length(24)
      .nullish(),
    membershipId: z
      .string({
        required_error: 'membership ID is required'
      })
      .length(24)
      .nullish(),
    paymentId: z
      .string({
        required_error: 'payment ID is required'
      })
      .length(24)
      .nullish()
  })
})

export const updateStudentSchema = z.object({
  params: z.object({
    id: z
      .string({
        required_error: 'ID is required'
      })
      .length(24, { message: 'ID must be 24 characters' })
  }),
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required'
      })
      .nullish(),
    lastname: z
      .string({
        required_error: 'Lastname is required'
      })
      .nullish(),
    birthday: z
      .string({
        required_error: 'Birthday is required'
      })
      .datetime({ offset: true })
      .nullish(),
    dni: z
      .number({
        required_error: 'DNI is required'
      })
      .min(10_000_000)
      .max(99_999_999)
      .nullish(),
    email: z
      .string({
        required_error: 'Email is required'
      })
      .email({ message: 'Email is not valid' })
      .nullish(),
    ruc: z
      .number({
        required_error: 'Ruc is required'
      })
      .nullish(),
    businessName: z
      .string({
        required_error: 'BusinessName is required'
      })
      .nullish(),
    address: z
      .string({
        required_error: 'Address is required'
      })
      .nullish(),
    country: z
      .string({
        required_error: 'Country is required'
      })
      .nullish(),
    phoneCode: z
      .string({
        required_error: 'Country is required'
      })
      .nullish(),
    phone: z
      .number({
        required_error: 'Phone is required'
      })
      .nullish(),
    phoneWithFormat: z
      .string({
        required_error: 'Phone With Format is required'
      })
      .nullish(),
    ladline: z
      .number({
        required_error: 'Ladline is required'
      })
      .nullish(),
    ladlineWithFormat: z
      .number({
        required_error: 'Ladline With Format is required'
      })
      .nullish(),
    postgraduateTraining: z
      .boolean({
        required_error: 'postgraduateTraining is required'
      })
      .nullish(),
    graduateTraining: z
      .boolean({
        required_error: 'graduateTraining is required'
      })
      .nullish(),
    bachelorTraining: z
      .boolean({
        required_error: 'bachelorTraining is required'
      })
      .nullish(),
    studentTraining: z
      .boolean({
        required_error: 'studentTraining is required'
      })
      .nullish(),

    studyCenter: z
      .string({
        required_error: 'studyCenter is required'
      })
      .nullish(),
    workplace: z
      .string({
        required_error: 'workplace is required'
      })
      .nullish(),
    workPosition: z
      .string({
        required_error: 'workPosition is required'
      })
      .nullish(),
    workAddress: z
      .string({
        required_error: 'workAddress is required'
      })
      .nullish(),
    status: z
      .boolean({
        required_error: 'status is required'
      })
      .nullish(),
    enrollmentId: z
      .string({
        required_error: 'enrollment ID is required'
      })
      .length(24)
      .nullish(),
    certificateId: z
      .string({
        required_error: 'certificate ID is required'
      })
      .length(24)
      .nullish(),
    membershipId: z
      .string({
        required_error: 'membership ID is required'
      })
      .length(24)
      .nullish(),
    paymentId: z
      .string({
        required_error: 'payment ID is required'
      })
      .length(24)
      .nullish()
  })
})

export const findStudentByIdSchema = z.object({
  params: z.object({
    id: z
      .string({
        required_error: 'ID is required'
      })
      .length(24, { message: 'ID must be 24 characters' })
  })
})

export const findStudentSchema = z.object({
  query: z
    .object({
      name: z.string({}).nullish(),
      dni: z.string({}).nullish()
    })
    .superRefine((val, ctx) => {
      const { name, dni } = val
      if (isEmpty(name) && isEmpty(dni)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Name or dni is required',
          fatal: true
        })
      }
    })
})

export type RegisterStudentInput = TypeOf<typeof registerStudentSchema>['body']

export type UpdateStudentInput = TypeOf<typeof updateStudentSchema>['body']
