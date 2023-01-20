import { PrismaClient } from '@prisma/client'
import express from 'express'
const app = express()

const prisma = new PrismaClient()
app.use(express.json())

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

app.listen(5000, () => {
  console.log('🚀 Server ready at: http://localhost:5000')
}
)

const addition = (a: number, b: number): number => a + b

export { addition }
