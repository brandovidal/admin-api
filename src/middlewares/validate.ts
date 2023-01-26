import { Request, Response, NextFunction } from 'express'
import { AnyZodObject, ZodError } from 'zod'

import { HttpCode } from '../types/http-code'
import { error } from '../utils/message'

export const validate =
  (schema: AnyZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse({
          params: req.params,
          query: req.query,
          body: req.body
        })

        next()
      } catch (err) {
        console.log('🚀 ~ file: validate.ts:16 ~ err', err)
        if (err instanceof ZodError) {
          // return res.status(400).json({
          //   status: 'fail',
          //   errors: error.errors
          // })

          const errors = err.issues.map((e) => ({ path: e.path[0], message: e.message }))

          const result = error({ status: HttpCode.BAD_REQUEST, code: 'validation_error', message: 'User validation with erros', error: errors })
          return res.status(HttpCode.BAD_REQUEST).json(result)
        }
        next(error)
      }
    }
