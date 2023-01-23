import express, { Application } from 'express'
import morgan from 'morgan'
import cors from 'cors'

import { router } from './routes'

// NOTE: List of things 🤔
// TODO: Add a logger

const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.text())
app.use(express.json({ type: 'application/json', limit: '2kb' }))

app.use(morgan('tiny'))
app.use(express.static('public'))

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

// Routes
app.use('/', router)

const port = process.env.PORT ?? 5000

// Service
app.listen(port, () => { console.log(`🚀 Server ready at: http://localhost:${port}}`) })

export { app }
