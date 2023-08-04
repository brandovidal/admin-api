import { Router } from 'express'

// Schemas
import { findUserByIdSchema, findUserSchema, createUserSchema, updateUserSchema, updateUserStatusSchema } from './schema'

// Middlewarea
import { deserializeUser } from '../../middlewares/deserializeUser'
import { validate } from '../../middlewares/validate'

// Handler
import { create, getMe, getUser, getUserbyId, getUsers, remove, update, updateStatus } from './handler'

const router = Router()

// router.use(deserializeUser)

router.get('/', getUsers)

router.get('/user', [validate(findUserSchema)], getUser)
router.get('/me', [deserializeUser], getMe)
router.get('/:id', [validate(findUserByIdSchema)], getUserbyId)

router.post('/', [validate(createUserSchema)], create)
router.put('/:id/status', [validate(updateUserStatusSchema)], updateStatus)
router.put('/:id', [validate(updateUserSchema)], update)
router.delete('/:id', remove)

export default router
