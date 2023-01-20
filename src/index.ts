// import { PrismaClient } from '@prisma/client'
import express from 'express'

import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cors from 'cors'

import { router } from './routes'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.text())
app.use(bodyParser.json({ type: 'application/json', limit: '2kb' }))

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

// Routes
app.use('/', router)

app.get('/', function (req, res) {
  res.send('Node API is running!')
})

// app.get('/users', async (req, res) => {
//   const users = await prisma.user.findMany()
//   res.json(users)
// })

// app.post('/users', async (req, res) => {
//   const users = await prisma.user.findMany()
//   res.json(users)
// })

const port = process.env.PORT ?? 5000

app.listen(port, () => {
  console.log('🚀 Server ready at: http://localhost:5000')
}
)

const addition = (a: number, b: number): number => a + b

export { addition }
