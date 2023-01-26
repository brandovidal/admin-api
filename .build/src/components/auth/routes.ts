import express from 'express'
import {
  loginUserHandler,
  logoutUserHandler,
  refreshAccessTokenHandler,
  registerUserHandler
} from './handler'

import { deserializeUser } from '../../middlewares/deserializeUser'
import { requireUser } from '../../middlewares/requireUser'
import { validate } from '../../middlewares/validate'

import {
  loginUserSchema,
  registerUserSchema
} from './schema'

const router = express.Router()

router.post('/register', validate(registerUserSchema), registerUserHandler)

router.post('/login', validate(loginUserSchema), loginUserHandler)

router.get('/refresh', refreshAccessTokenHandler)

// router.get(
//   '/verifyemail/:verificationCode',
//   validate(verifyEmailSchema),
//   verifyEmailHandler
// )

router.get('/logout', deserializeUser, requireUser, logoutUserHandler)

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
