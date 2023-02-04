import { type Program } from '@prisma/client'

export interface ProgramWhereParams extends Program {
  page?: number
  size?: number
}

export interface ProgramsResponse {
  count?: number
  total?: number
  programs: Program[]
}
export interface ProgramResponse {
  program: Program | null
}

export interface ProgramLoggedResponse {
  program: Program
  isLogged: boolean
}

export interface ProgramToken {
  accessToken: string
  refreshToken: string
}
