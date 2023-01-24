import { Router } from 'express'

// Schemas
import { userSchema } from './schema'

// Middlewarea
import { userSchemaValidaton, userExistValidaton, userNotExistValidaton } from '../../middlewares/user'

// handler
import { create, getUser, getUserbyId, getUsers, remove, update } from './handler'

const router = Router()

router.get('/', getUsers)
router.get('/user', getUser)
router.get('/:id', getUserbyId)
router.post('/', [userSchemaValidaton(userSchema), userExistValidaton], create)
router.put('/:id', [userNotExistValidaton], update)
router.delete('/:id', [userNotExistValidaton], remove)

export default router
