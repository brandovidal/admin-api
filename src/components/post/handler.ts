import { type NextFunction, type Request, type Response } from 'express'
import isEmpty from 'just-is-empty'

import { HttpCode } from '../../types/response'

import { AppError, AppSuccess } from '../../utils'

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

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'post list successfully', { posts, count, total }))
  } catch (err) {
    res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'posts_not_exist', 'Posts not exist'))
  }
}

// Find only one post
export const getPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query

    const title = query.title?.toString() ?? ''
    const content = query.content?.toString() ?? ''

    const post = await controller.getPost(title, content)

    if (isEmpty(post)) {
      res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'post_not_exist', 'Post not exist'))
      return
    }

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'find post successfully', post))
  } catch (err) {
    res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'post_not_exist', 'Post not exist'))
  }
}

// Find posts
export const getPostbyId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const postId: string = req.params?.id
    const post = await controller.getPostId(postId)

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'post list successfully', post))
  } catch (err) {
    res.status(HttpCode.FORBIDDEN).json(AppError(HttpCode.FORBIDDEN, 'post_not_exist', 'Post not exist'))
  }
}

// create post
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const createdPost = await controller.createPost(req.body)

    res.status(HttpCode.CREATED).json(AppSuccess(HttpCode.CREATED, 'success', 'post created successfully', createdPost))
  } catch (err) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(AppError(HttpCode.INTERNAL_SERVER_ERROR, 'internal_server_error', 'Internal server error'))
  }
}

// update post
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId: string = req.params?.id
    const updatedPost = await controller.updatePost(postId, req.body)

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'post updated successfully', updatedPost))
  } catch (err) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(AppError(HttpCode.INTERNAL_SERVER_ERROR, 'internal_server_error', 'Internal server error'))
  }
}

// delete post
export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId: string = req.params?.id
    const deletedPost = await controller.deletePost(postId)

    res.status(HttpCode.OK).json(AppSuccess(HttpCode.OK, 'success', 'post deleted successfully', deletedPost))
  } catch (err) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(AppError(HttpCode.INTERNAL_SERVER_ERROR, 'internal_server_error', 'Internal server error'))
  }
}
