import type { NextFunction, Request, Response } from 'express'
import { type AnyZodObject, ZodError } from 'zod'

import { HttpCode } from '../types/response'

import { AppError } from '../utils/appError'

export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      params: req.params,
      query: req.query,
      body: req.body
    })
    next()
  } catch (err) {
    if (err instanceof ZodError) {
      const details = err.errors?.map(({ path, code, message }) => ({ name: path.at(1) ?? 'error', code, message }))
      const result = AppError(HttpCode.BAD_REQUEST, 'validation_error', 'Validation with errors', details)
      res.status(HttpCode.BAD_REQUEST).json(result)
    }
    next(err)
  }
}
