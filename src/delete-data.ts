import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const deleteData = async (): Promise<void> => {
//   await prisma.user.delete({
//     where: {
//       id: '63ca41917e23d6b105fe5f1d'
//     }
//   })

  await prisma.user.delete({
    where: {
      email: 'jon.snow@got.com'
    }
  })

  // Delete all the posts of an author
  //   await prisma.post.deleteMany({
  //     where: {
  //       authorId: '63ca42996191dc33f46dbedc'
  //     }
  //   })

  // Delete all posts where the title content "how to"
//   await prisma.post.deleteMany({
//     where: {
//       title: {
//         contains: 'how to'
//       }
//     }
//   })
}

void deleteData().then()
