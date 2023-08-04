import type { MetaResponse } from '@/interfaces/utils/response'
import { aproximateNumber } from './number'

export function getPagination (page: number, total: number, pageSize: number): MetaResponse {
  const pageCount = aproximateNumber(total, pageSize)
  return { pagination: { page, pageSize, pageCount, total } }
}
