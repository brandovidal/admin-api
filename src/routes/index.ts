import { Router } from 'express'

import userRouter from '../components/user/routes'
const router = Router()

router.use('/user', userRouter)

router.get('/', function (req, res) {
  res.send('Node API is running!')
})

export { router }
