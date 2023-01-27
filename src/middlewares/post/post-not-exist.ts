import { type NextFunction, type Request, type Response } from 'express'

import { getPostById } from '../../components/post/repository'

import { HttpCode } from '../../types/response'

import { AppError } from '../../utils/appError'

export const postNotExistValidaton = async (req: Request, res: Response, next: NextFunction): Promise<Response<object, Record<string, object>> | undefined> => {
  try {
    const postId: string = req.params?.id
    const postFinded = await getPostById(postId)

    if (postFinded === null) {
      const result = AppError(HttpCode.FORBIDDEN, 'post_not_exist', 'Post not exist')
      return res.status(HttpCode.FORBIDDEN).json(result)
    }
    next()
  } catch (err) {
    const result = AppError()
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(result)
  }
}
