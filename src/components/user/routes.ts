import { Router } from 'express'

// Schemas
import { userSchema } from './schema'

// Middlewarea
import { userSchemaValidaton } from './middlewares/schema-validation'
import { userExistValidaton } from './middlewares/user-exist'
import { userNotExistValidaton } from './middlewares/user-not-exist'

// handler
import { create, getUserbyId, getUsers, remove, update } from './handler'

const router = Router()

router.get('/', getUsers)
router.get('/:id', getUserbyId)
router.post('/', [userSchemaValidaton(userSchema), userExistValidaton], create)
router.put('/:id', [userNotExistValidaton], update)
router.delete('/:id', [userNotExistValidaton], remove)

export default router
