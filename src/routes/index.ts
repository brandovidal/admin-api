import { Router } from 'express'

import userRouter from '../components/user/routes'
import swaggerUi from 'swagger-ui-express'

const router = Router()

router.use('/users', userRouter)

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
