import { type NextFunction, type Request, type Response } from 'express'

import { getPost } from '../../components/post/repository'

import { HttpCode } from '../../types/response'

import { AppError } from '../../utils/appError'

export const postExistValidaton = async (req: Request, res: Response, next: NextFunction): Promise<Response<object, Record<string, object>> | undefined> => {
  try {
    const body = req.body

    const title = body.title?.toString() ?? ''
    const content = body.content?.toString() ?? ''

    const post = await getPost(title, content)

    if (post !== null) {
      res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'post_not_exist', 'Post not exist'))
      return
    }
    next()
  } catch (err) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(AppError())
  }
}
