import type { Post as PostType } from '@prisma/client'

import { Get, Post, Put, Delete, Path, Route, Body, SuccessResponse, Query, Response, Tags } from 'tsoa'

import { createPost, getPosts, deletePost, updatePost, getPostById, getPost } from './repository'

import type { ForbiddenErrorJSON, InternalErrorJSON, ValidateErrorJSON } from '../../interfaces/response'

@Tags('Post')
@Route('/api/posts')
export default class PostController {
  /**
   * The `getPosts` function takes in a `title`, `content`, `page` and `size` query parameter and returns a `PostsResponse`
  * @param {string} [title] - string
  * @param {string} [content] - string
  * @param [page=1] - The page number of the results to return.
  * @param [size=10] - The number of items to return per page.
  * @returns The return type is PostsResponse.
  */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/')
  public async getPosts(@Query() title?: string, @Query() content?: string, @Query() page = 1, @Query() size = 10) {
    return await getPosts(title, content, page, size)
  }

  /**
  * The `getPost` function takes in a `title` and `content` query parameter and returns a `PostResponse`
  * object
  * @param {string} [title] - string - This is the title of the post.
  * @param {string} [content] - The content of the post to get.
  * @returns A promise of a PostResponse object
  */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/post')
  public async getPost(@Query() title?: string, @Query() content?: string) {
    return await getPost(title, content)
  }

  /**
   * The `getPostId` function takes in a `id` path parameter and returns a promise of a Post object
   * @param {string} id - string - This is the path parameter. It's the id of the post we want to get.
   * @returns The post object
   */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ForbiddenErrorJSON>(403, 'Forbidden')
  @Get('/{id}')
  public async getPostId(@Path() id: string) {
    return await getPostById(id)
  }

  /**
   * The `createPost` function takes in a `Post` object and returns a promise of a Post object
   * @param {Post} requestBody - Post
   * @returns A promise of a post object
   */
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ValidateErrorJSON>(400, 'Validation Failed')
  @SuccessResponse('201', 'Created')
  @Post('/')
  public async createPost(@Body() requestBody: PostType) {
    return await createPost(requestBody)
  }

  /**
   * The `updatePost` function takes in a `id` path parameter and a `Post` object and returns a promise of a Post object
   * @param {string} id - string - This is the id of the post we want to update.
   * @param {Post} requestBody - This is the body of the request. It's the data that the post is
   * sending to the server.
   * @returns The updated post
   */
  @Put('/{id}')
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  @Response<ValidateErrorJSON>(400, 'Validation Failed')
  public async updatePost(@Path() id: string, @Body() requestBody: PostType) {
    return await updatePost(id, requestBody)
  }

  /**
   * The `deletePost` function takes in a `id` path parameter and returns a promise of a Post object
   * @param {string} id - string - This is the path parameter. It's the id of the post we want to
   * delete.
   * @returns The post that was deleted
   */
  @Delete('/{id}')
  @Response<InternalErrorJSON>(500, 'Internal Server Error')
  public async deletePost(@Path() id: string) {
    return await deletePost(id)
  }
}
