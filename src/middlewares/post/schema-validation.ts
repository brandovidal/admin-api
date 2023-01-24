
import { NextFunction, Request, Response } from 'express'
import { AnyZodObject, ZodError } from 'zod'

import { HttpCode } from '../../types/http-code'
import { error } from '../../utils/message'

export const postSchemaValidaton = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync(req.body)
    next()
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = err.issues.map((e) => ({ path: e.path[0], message: e.message }))

      const result = error({ status: HttpCode.BAD_REQUEST, code: 'validation_error', message: 'Post validation with erros', error: errors })
      return res.status(HttpCode.BAD_REQUEST).json(result)
    }
    const result = error({ status: HttpCode.INTERNAL_SERVER_ERROR, code: 'internal_server_error', message: 'Internal server error' })
    return res.status(HttpCode.INTERNAL_SERVER_ERROR).json(result)
  }
}
