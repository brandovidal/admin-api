import { PrismaClient, Tag, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export const insertUserAndPost = async (): Promise<void> => {
  const userInput: Prisma.UserUncheckedCreateInput = {
    email: 'jon.snow@got.com',
    name: 'Jon Snow',
    dateOfBirth: new Date(1995, 1, 23),
    location: {
      address: "2 Rue de l'opera",
      city: 'Paris',
      country: 'FRA'
    }
  }

  const createdUser = await prisma.user.create({
    data: userInput
  })

  const commentsInput: Prisma.CommentCreateInput[] = [
    {
      text: 'My first comment',
      voteCount: 14,
      updatedAt: new Date()
    }
  ]

  const postInput: Prisma.PostUncheckedCreateInput = {
    authorId: createdUser.id,
    comments: commentsInput,
    content: 'My first post text content',
    isPublished: false,
    tags: [Tag.NodeJS, Tag.Docker, Tag.GraphQL],
    title: 'My first post title',
    viewCount: 23
  }

  const createdPost = await prisma.post.create({
    data: postInput
  })

  console.log({ createdUser })
  console.log({ createdPost })
}

void insertUserAndPost().then()
