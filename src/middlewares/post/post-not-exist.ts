import { NextFunction, Request, Response } from 'express'

import { HttpCode } from '../../types/http-code'
import { error } from '../../utils/message'

import { getPostById } from '../../components/post/repository'

export const postNotExistValidaton = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined> => {
  try {
    const postId: string = req.params.id
    const postFinded = await getPostById(postId)

    if (postFinded === null) {
      const result = error({ status: HttpCode.FORBIDDEN, code: 'post_not_exist', message: 'Post not exist' })
      return res.status(HttpCode.FORBIDDEN).json(result)
    }
    next()
  } catch (err) {
    const result = error({ status: HttpCode.INTERNAL_SERVER_ERROR, code: 'internal_server_error', message: 'Internal server error' })
    return res.status(HttpCode.INTERNAL_SERVER_ERROR).json(result)
  }
}
