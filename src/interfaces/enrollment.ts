import { type Enrollment } from '@prisma/client'

export interface EnrollmentsResponse {
  count?: number
  total?: number
  enrollments: Enrollment[]
}