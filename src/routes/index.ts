import { Router, type NextFunction, type Request, type Response } from 'express'
import swaggerUi from 'swagger-ui-express'

// Component
import authRouter from '../components/auth/routes'
import userRouter from '../components/user/routes'
import programRouter from '../components/program/routes'
import courseRouter from '../components/course/routes'
import countryRouter from '../components/country/routes'
import studentRouter from '../components/student/routes'
import enrollmentRouter from '../components/enrollment/routes'
import certificateRouter from '../components/certificate/routes'
import membershipRouter from '../components/membership/routes'
import paymentRouter from '../components/payment/routes'

// Util
import type BaseError from '../utils/appError'
import { AppError } from '../utils'

// Type
import { HttpCode } from '../types/response'

const router = Router()

// TODO: update response type
router.use('/api/auth', authRouter)
router.use('/api/users', userRouter)
router.use('/api/programs', programRouter)
router.use('/api/courses', courseRouter)
router.use('/api/countries', countryRouter)
router.use('/api/students', studentRouter)
router.use('/api/enrollments', enrollmentRouter)
router.use('/api/certificates', certificateRouter)
router.use('/api/memberships', membershipRouter)
router.use('/api/payments', paymentRouter)

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
  const { message, error } = err

  res.status(error.code).json(AppError(error.code, error.name, message))
})

export { router }
