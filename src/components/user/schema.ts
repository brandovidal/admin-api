import { z } from 'zod'

export const userSchema = z.object({
  email: z.string({ required_error: 'Email is required', invalid_type_error: 'Email must be a string' }).email({ message: 'Email must be a valid email' }),
  name: z.string({ required_error: 'Name is required', invalid_type_error: 'Name must be a string' }),
  dateOfBirth: z.string().datetime({ message: 'Date must be a valid date', offset: true }),
  location: z.object({
    address: z.string(),
    city: z.string(),
    country: z.string()
  })
})
