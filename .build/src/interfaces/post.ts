import { Post } from '@prisma/client'

export interface PostWhereParams extends Post {
  page?: number
  size?: number
}

export interface PostsResponse { count?: number, total?: number, posts: Post[] }
export interface PostResponse { post: Post | null }
