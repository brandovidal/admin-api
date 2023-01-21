import express from 'express'

import dotenv from 'dotenv'
import cors from 'cors'

import { router } from './routes'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.text())
app.use(express.json({ type: 'application/json', limit: '2kb' }))

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

// Routes
app.use('/', router)

const port = process.env.PORT ?? 5000

// Service
app.listen(port, () => { console.log('🚀 Server ready at: http://localhost:5000') })

export { app }
