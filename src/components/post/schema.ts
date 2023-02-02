import { boolean, nativeEnum, number, object, optional, string, z } from 'zod'
import type { TypeOf } from 'zod'

export const postSchema = z.object({
  authorId: z.string({ required_error: 'Author ID is required', invalid_type_error: 'Author ID must be a string' }).length(24),
  title: z.string({ required_error: 'Title is required', invalid_type_error: 'Title must be a string' }),
  content: z.string({ required_error: 'Content is required', invalid_type_error: 'Content must be a string' }),
  viewCount: z.number({ required_error: 'View count is required', invalid_type_error: 'View count must be a number' }),
  isPublished: z.boolean({ required_error: 'Published is required', invalid_type_error: 'Published must be a boolean' }),
  tags: z.array(z.string()).optional(),
  comments: z.array(
    z.object({
      text: z.string(),
      voteCount: z.number(),
      updatedAt: z.string().datetime({ message: 'Date must be a valid date', offset: true })
    })
  ).optional()
})

enum TagEnumType {
  NODEJS = 'NodeJS',
  JAVA = 'Java',
  REACT = 'React',
  GRAPHQL = 'GraphQL',
  SPRING = 'Spring',
  TYPESCRIPT = 'Typescript',
  EXPRESS = 'Express',
  DOCKER = 'Docker',
  JEST = 'Jest',
  JENKINS = 'Jenkins',
  AWS = 'AWS',
}

export const registerPostSchema = object({
  body: object({
    authorId: string({
      required_error: 'Author ID is required',
      invalid_type_error: 'Author ID must be a string'
    }).length(24),
    title: string({
      required_error: 'Title is required'
    }),
    content: string({
      required_error: 'Content is required'
    }),
    viewCount: number({
      required_error: 'viewCount is required'
    }),
    isPublished: boolean({
      required_error: 'Published is required'
    }),
    tags: optional(nativeEnum(TagEnumType)),
    comments: optional(z.array(
      z.object({
        text: z.string({}),
        voteCount: z.number({}),
        updatedAt: z.string({}).datetime({ message: 'Date must be a valid date', offset: true })
      })
    ))
  })
})

export const updateUserSchema = object({
  body: object({
    authorId: string({}),
    title: string({}),
    content: string({}),
    viewCount: number({}),
    isPublished: boolean({}),
    tags: optional(nativeEnum(TagEnumType)),
    comments: optional(z.array(
      z.object({
        text: z.string({}),
        voteCount: z.number({}),
        updatedAt: z.string({}).datetime({ message: 'Date must be a valid date', offset: true })
      })
    ))
  })
})

export type RegisterPostInput = TypeOf<typeof registerPostSchema>['body']

export type UpdatePostInput = TypeOf<typeof updateUserSchema>['body']
