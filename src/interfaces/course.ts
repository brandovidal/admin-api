import { type Course } from '@prisma/client'

export interface CoursesResponse {
  count?: number
  total?: number
  courses: Course[]
}
