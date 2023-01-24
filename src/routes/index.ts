import { Router } from 'express'

import userRouter from '../components/user/routes'
import postRouter from '../components/post/routes'

import swaggerUi from 'swagger-ui-express'

const router = Router()

router.use('/users', userRouter)
router.use('/posts', postRouter)

router.get('/', function (req, res) {
  res.send('Node API is running!')
})

router.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: '/swagger.json'
    }
  })
)

export { router }
