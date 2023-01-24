import { NextFunction, Request, Response } from 'express'

import { HttpCode } from '../../types/http-code'
import { error } from '../../utils/message'

import { getPost } from '../../components/post/repository'

export const postExistValidaton = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined> => {
  try {
    const body = req.body

    const title = body.title?.toString() ?? ''
    const content = body.content?.toString() ?? ''

    const { post } = await getPost(title, content)
    console.log('🚀 ~ file: post-exist.ts:16 ~ postExistValidaton ~ post', post)

    if (post !== null) {
      const result = error({ status: HttpCode.FORBIDDEN, code: 'post_exist', message: 'Post already exist' })
      return res.status(HttpCode.FORBIDDEN).json(result)
    }
    next()
  } catch (err) {
    const result = error({ status: HttpCode.INTERNAL_SERVER_ERROR, code: 'internal_server_error', message: 'Internal server error' })
    return res.status(HttpCode.INTERNAL_SERVER_ERROR).json(result)
  }
}
