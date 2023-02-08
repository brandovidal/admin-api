import { Router, type NextFunction, type Request, type Response } from 'express'
import swaggerUi from 'swagger-ui-express'

// Component
import authRouter from '../components/auth/routes'
import userRouter from '../components/user/routes'
import programRouter from '../components/program/routes'
import courseRouter from '../components/course/routes'

// Util
import type BaseError from '../utils/appError'
import { AppError } from '../utils'

// Type
import { HttpCode } from '../types/response'

const router = Router()

router.use('/api/auth', authRouter)
router.use('/api/users', userRouter)
router.use('/api/programs', programRouter)
router.use('/api/courses', courseRouter)

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

router.all('*', (req: Request, res: Response, next: NextFunction): void => {
  next(AppError(HttpCode.NOT_FOUND, 'route_not_found', `Route ${req.originalUrl} not found`))
})

router.use((err: BaseError, req: Request, res: Response, next: NextFunction) => {
  const { status, code, message } = err
  res.status(status).json(AppError(status, code, message))
})

export { router }
