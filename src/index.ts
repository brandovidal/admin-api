import { PrismaClient } from '@prisma/client'
import express from 'express'
import bodyParser from 'body-parser'

const app = express()

const prisma = new PrismaClient()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.text())
app.use(bodyParser.json({ type: 'application/json' }))

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
