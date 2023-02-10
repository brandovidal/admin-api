import { type Membership } from '@prisma/client'

export interface MembershipsResponse {
  count?: number
  total?: number
  memberships: Membership[]
}