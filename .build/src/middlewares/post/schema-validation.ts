
import { NextFunction, Request, Response } from 'express'
import { AnyZodObject, ZodError } from 'zod'

import { HttpCode } from '../../types/response'

import { AppError } from '../../utils/appError'

export const postSchemaValidaton = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync(req.body)
    next()
  } catch (err) {
    if (err instanceof ZodError) {
      const validations = err.errors?.map(({ path, code, message }) => ({ name: path.at(1) ?? 'error', code, message }))

      const result = AppError(HttpCode.BAD_REQUEST, 'validation_error', 'Validation with errors', validations)
      res.status(HttpCode.BAD_REQUEST).json(result)
    }
    const result = AppError()
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(result)
  }
}
