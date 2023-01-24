import { NextFunction, Request, Response } from 'express'
import isEmpty from 'just-is-empty'

import { HttpCode } from '../../types/http-code'
import { error, success } from '../../utils/message'

import PostController from './controller'

const controller = new PostController()

// Find posts
export const getPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query

    const title = query.title?.toString()
    const content = query.content?.toString()
    const page = parseInt(query.page?.toString() ?? '1')
    const size = parseInt(query.size?.toString() ?? '10')

    const { count, total, posts } = await controller.getPosts(title, content, page, size)

    const result = success({ status: HttpCode.OK, data: posts, count, total, code: 'success', message: 'post list successfully' })
    res.json(result)
  } catch (err: any) {
    const result = error({ status: HttpCode.FORBIDDEN, code: 'posts_not_exist', message: 'Posts not exist' })
    res.status(HttpCode.FORBIDDEN).json(result)
  }
}

// Find only one post
export const getPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query

    const title = query.title?.toString() ?? ''
    const content = query.content?.toString() ?? ''

    const { post } = await controller.getPost(title, content)

    if (isEmpty(post)) {
      const result = error({ status: HttpCode.FORBIDDEN, code: 'post_not_exist', message: 'Post not exist' })
      res.status(HttpCode.FORBIDDEN).json(result)
      return
    }

    const result = success({ status: HttpCode.OK, data: post, count: 1, code: 'success', message: 'find post successfully' })
    res.json(result)
  } catch (err: any) {
    const result = error({ status: HttpCode.FORBIDDEN, code: 'post_not_exist', message: 'Post not exist' })
    res.status(HttpCode.FORBIDDEN).json(result)
  }
}

// Find posts
export const getPostbyId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const postId: string = req.params?.id
    const post = await controller.getPostId(postId)

    const result = success({ status: HttpCode.OK, data: post, code: 'success', message: 'post list successfully' })
    res.json(result)
  } catch (err: any) {
    const result = error({ status: HttpCode.FORBIDDEN, code: 'post_not_exist', message: 'Post not exist' })
    res.status(HttpCode.FORBIDDEN).json(result)
  }
}

// create post
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const createdPost = await controller.createPost(req.body)

    const result = success({ status: HttpCode.CREATED, data: createdPost, code: 'success', message: 'post created successfully' })
    res.status(200).json(result)
  } catch (err: any) {
    const result = error({ status: HttpCode.INTERNAL_SERVER_ERROR, code: 'internal_server_error', message: 'Internal server error' })
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(result)
  }
}

// update post
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId: string = req.params?.id
    const updatedPost = await controller.updatePost(postId, req.body)

    const result = success({ status: HttpCode.OK, data: updatedPost, code: 'success', message: 'post updated successfully' })
    res.json(result)
  } catch (err: any) {
    const result = error({ status: HttpCode.INTERNAL_SERVER_ERROR, code: 'internal_server_error', message: 'Internal server error' })
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(result)
  }
}

// delete post
export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId: string = req.params?.id
    const deletedPost = await controller.deletePost(postId)

    const result = success({ status: HttpCode.OK, data: deletedPost, code: 'success', message: 'post deleted successfully' })
    res.json(result)
  } catch (err: any) {
    const result = error({ status: HttpCode.INTERNAL_SERVER_ERROR, code: 'internal_server_error', message: 'Internal server error' })
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(result)
  }
}
