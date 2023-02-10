import { type Student } from '@prisma/client'

export interface StudentsResponse {
  count?: number
  total?: number
  students: Student[]
}