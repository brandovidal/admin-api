import { object, string, z } from 'zod'
import type { TypeOf } from 'zod'
import isEmpty from 'just-is-empty'

export const registerCountrySchema = object({
  body: object({
    name: string({
      required_error: 'Name is required'
    }),
    otherName: string({
      required_error: 'Other name is required'
    }),
    iso2: string({
      required_error: 'iso2 is required'
    }),
    iso3: string({
      required_error: 'iso3 is required'
    })
  })
})

export const updateCountrySchema = object({
  params: object({
    id: string({
      required_error: 'ID is required'
    }).length(24, { message: 'ID must be 24 characters' })
  }),
  body: object({
    name: string({
      required_error: 'Name is required'
    }),
    otherName: string({
      required_error: 'Other name is required'
    }),
    iso2: string({
      required_error: 'iso2 is required'
    }),
    iso3: string({
      required_error: 'iso3 is required'
    })
  })
})

export const findCountryByIdSchema = object({
  params: object({
    id: string({
      required_error: 'ID is required'
    }).length(24, { message: 'ID must be 24 characters' })
  })
})

export const findCountrySchema = object({
  query: object({
    name: string({}).nullish(),
    iso3: string({}).nullish()
  }).superRefine((val, ctx) => {
    const { name, iso3 } = val
    if (isEmpty(name) && isEmpty(iso3)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Name or iso3 is required',
        fatal: true
      })
    }
  })
})

export type RegisterCountryInput = TypeOf<typeof registerCountrySchema>['body']

export type UpdateCountryInput = TypeOf<typeof updateCountrySchema>['body']
