import { Request, Response, NextFunction } from 'express'
import { AnyZodObject, ZodError } from 'zod'

import { AppError } from '../utils/appError'

import { HttpCode } from '../types/response'

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
      const validations = err.errors?.map(({ path, code, message }) => ({ name: path.at(1) ?? 'error', code, message }))

      const result = AppError(HttpCode.BAD_REQUEST, 'validation_error', 'Validation with errors', validations)
      res.status(HttpCode.BAD_REQUEST).json(result)
      return result
    }
    next(err)
  }
}
