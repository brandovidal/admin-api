import { Router } from 'express'

// Schemas
import { registerUserSchema, updateUserSchema } from './schema'

// Middlewarea
import { userExistValidaton, userNotExistValidaton } from '../../middlewares/user'

// handler
import { create, getMe, getUser, getUserbyId, getUsers, remove, update } from './handler'

import { deserializeUser } from '../../middlewares/deserializeUser'
import { validate } from '../../middlewares/validate'

const router = Router()

// router.use(deserializeUser)

router.get('/', getUsers)
router.get('/user', getUser)
router.get('/me', [deserializeUser], getMe)
router.get('/:id', getUserbyId)
router.post('/', [validate(registerUserSchema), userExistValidaton], create)
router.put('/:id', [validate(updateUserSchema), userNotExistValidaton], update)
router.delete('/:id', [userNotExistValidaton], remove)

export default router
