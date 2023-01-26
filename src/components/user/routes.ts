import { Router } from 'express'

// Schemas
import { createUserSchema } from './schema'

// Middlewarea
import { userSchemaValidaton, userExistValidaton, userNotExistValidaton } from '../../middlewares/user'

// handler
import { create, getMeHandler, getUser, getUserbyId, getUsers, remove, update } from './handler'

import { deserializeUser } from '../../middlewares/deserializeUser'
// import { requireUser } from '../../middlewares/requireUser'

const router = Router()

// router.use(deserializeUser, requireUser)

router.get('/', getUsers)
router.get('/user', getUser)
router.get('/me', [deserializeUser], getMeHandler)
router.get('/:id', getUserbyId)
router.post('/', [userSchemaValidaton(createUserSchema), userExistValidaton], create)
router.put('/:id', [userNotExistValidaton], update)
router.delete('/:id', [userNotExistValidaton], remove)

export default router
