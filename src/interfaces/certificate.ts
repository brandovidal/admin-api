import { type Certificate } from '@prisma/client'

export interface CertificatesResponse {
  count?: number
  total?: number
  certificates: Certificate[]
}
