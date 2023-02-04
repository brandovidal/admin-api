import express from 'express'

// Schemas
import { loginUserSchema, registerUserSchema } from './schema'

// Middlewarea
import { deserializeUser } from '../../middlewares/deserializeUser'
import { requireUser } from '../../middlewares/requireUser'
import { validate } from '../../middlewares/validate'

// Handler
import { login, logout, refreshAccessToken, register } from './handler'

const router = express.Router()

router.post('/register', validate(registerUserSchema), register)

router.post('/login', validate(loginUserSchema), login)

router.get('/refresh', refreshAccessToken)

router.get('/logout', deserializeUser, requireUser, logout)

// router.get(
//   '/verifyemail/:verificationCode',
//   validate(verifyEmailSchema),
//   verifyEmailHandler
// )

// router.post(
//   '/forgotpassword',
//   validate(forgotPasswordSchema),
//   forgotPasswordHandler
// )

// router.patch(
//   '/resetpassword/:resetToken',
//   validate(resetPasswordSchema),
//   resetPasswordHandler
// )

export default router
