import { aproximateNumber } from './number'
import type { MetaType } from '../types/response'

export function getPagination (page: number, total: number, pageSize: number): MetaType {
  const pageCount = aproximateNumber(total, pageSize)
  return { pagination: { page, pageSize, pageCount, total } }
}
