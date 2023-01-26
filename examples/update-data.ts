import { Tag, PrismaClient } from '@prisma/client'
import { logger } from '../src/utils/logger'

const prisma = new PrismaClient()

export const updateData = async (): Promise<void> => {
  const [firstUser] = await prisma.user.findMany()

  const updatedUser = await prisma.user.update({
    where: {
      id: firstUser.id
    },
    data: {
      name: 'Ian Watson'
    }
  })

  logger.info(updatedUser)

  const [userPost] = await prisma.post.findMany({
    where: {
      authorId: firstUser.id
    }
  })

  const updatedPost = await prisma.post.update({
    where: {
      id: userPost.id
    },
    data: {
      isPublished: true,
      tags: [Tag.GraphQL, Tag.AWS, Tag.Jest]
    }
  })

  logger.info(updatedPost)
}

void updateData().then()
