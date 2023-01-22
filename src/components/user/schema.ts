import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  dateOfBirth: z.date(),
  location: z.object({
    address: z.string(),
    city: z.string(),
    country: z.string()
  })
})
