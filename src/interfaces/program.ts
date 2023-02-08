import { type Program } from '@prisma/client'

export interface ProgramsResponse {
  count?: number
  total?: number
  programs: Program[]
}