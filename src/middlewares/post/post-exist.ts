import { NextFunction, Request, Response } from 'express'

import { getPost } from '../../components/post/repository'

import { HttpCode } from '../../types/response'

import { AppError } from '../../utils/appError'

export const postExistValidaton = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined> => {
  try {
    const body = req.body

    const title = body.title?.toString() ?? ''
    const content = body.content?.toString() ?? ''

    const { post } = await getPost(title, content)

    if (post !== null) {
      const result = AppError(HttpCode.FORBIDDEN, 'post_not_exist', 'Post not exist')
      return res.status(HttpCode.FORBIDDEN).json(result)
    }
    next()
  } catch (err) {
    const result = AppError()
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(result)
  }
}
