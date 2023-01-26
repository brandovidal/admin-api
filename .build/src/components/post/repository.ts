import { PrismaClient, Post } from '@prisma/client'

import { CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'

import { PostsResponse, PostResponse } from '../../interfaces/post'

import { PAGE_DEFAULT, SIZE_DEFAULT, TTL_DEFAULT } from '../../constants/repository'

import isEmpty from 'just-is-empty'

const postCache = new CacheContainer(new MemoryStorage())

const prisma = new PrismaClient()

export const getPosts = async (title?: string, content?: string, page = PAGE_DEFAULT, size = SIZE_DEFAULT): Promise<PostsResponse> => {
  const take = size
  const skip = (page - 1) * take

  const cachedPosts = await postCache.getItem<Post[]>('get-posts') ?? []
  const cachedTotalPosts = await postCache.getItem<number>('total-posts') ?? 0

  // params
  const cachedTitle = await postCache.getItem<number>('get-title-posts')
  const cachedContent = await postCache.getItem<number>('get-content-posts')
  const cachedSize = await postCache.getItem<number>('get-size-posts')
  const cachedPage = await postCache.getItem<number>('get-page-posts')

  if (!isEmpty(cachedPosts) && cachedTitle === title && cachedContent === content && cachedSize === size && cachedPage === page) {
    return { count: cachedPosts.length, total: cachedTotalPosts, posts: cachedPosts }
  }

  const [total, posts] = await prisma.$transaction([
    prisma.post.count(),
    prisma.post.findMany({
      where: {
        title: { contains: title?.toString(), mode: 'insensitive' },
        content: { contains: content?.toString(), mode: 'insensitive' }
      },
      take,
      skip,
      orderBy: {
        updatedAt: 'asc'
      }
    })
  ])

  const count = posts.length

  await postCache.setItem('get-posts', posts, { ttl: TTL_DEFAULT })
  await postCache.setItem('total-posts', total, { ttl: TTL_DEFAULT })

  // params
  await postCache.setItem('get-title-posts', title, { ttl: TTL_DEFAULT })
  await postCache.setItem('get-content-posts', content, { ttl: TTL_DEFAULT })
  await postCache.setItem('get-size-posts', size, { ttl: TTL_DEFAULT })
  await postCache.setItem('get-page-posts', page, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return { count, total, posts }
}

export const getPostById = async (postId: string): Promise<Post | null> => {
  const cachedPostById = await postCache.getItem<Post>('get-post-by-id') ?? null
  const cachedPostId = await postCache.getItem<string>('get-id-post')

  if (!isEmpty(cachedPostById) && cachedPostId === postId) {
    return cachedPostById
  }

  const post = await prisma.post.findFirst({
    where: {
      id: postId
    }
  })

  await postCache.setItem('get-post-by-id', post, { ttl: TTL_DEFAULT })

  // params
  await postCache.setItem('get-id-post', postId, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return post
}

export const getPost = async (title?: string, content?: string): Promise<PostResponse> => {
  const cachedPost = await postCache.getItem<Post>('get-only-post') ?? null

  // params
  const cachedTitle = await postCache.getItem<number>('get-only-title')
  const cachedEmail = await postCache.getItem<number>('get-only-content')

  if (!isEmpty(cachedPost) && cachedTitle === title && cachedEmail === content) {
    return { post: cachedPost }
  }

  const post = await prisma.post.findFirst({
    where: {
      title: { contains: title?.toString(), mode: 'insensitive' },
      content: { contains: content?.toString(), mode: 'insensitive' }
    }
  })

  await postCache.setItem('get-only-post', post, { ttl: TTL_DEFAULT })

  // params
  await postCache.setItem('get-only-title', title, { ttl: TTL_DEFAULT })
  await postCache.setItem('get-only-content', content, { ttl: TTL_DEFAULT })

  void prisma.$disconnect()
  return { post }
}

export const createPost = async (postInput: Post): Promise<Post> => {
  const post = await prisma.post.create({ data: postInput })
  void prisma.$disconnect()
  return post
}

export const updatePost = async (postId: string, postInput: Post): Promise<Post> => {
  const post = await prisma.post.update({
    where: {
      id: postId
    },
    data: postInput
  })
  void prisma.$disconnect()
  return post
}

export const deletePost = async (postId: string): Promise<Post> => {
  const post = await prisma.post.delete({
    where: {
      id: postId
    }
  })
  void prisma.$disconnect()
  return post
}
