import { Router } from 'express'

// Schemas
import { userSchema } from './schema'

// Middlewarea
import { userSchemaValidaton, userExistValidaton, userNotExistValidaton } from '../../middlewares/user'

// handler
import { create, getUserbyId, getUsers, getUsersPaginate, remove, update } from './handler'

const router = Router()

router.get('/', getUsers)
router.get('/all', getUsersPaginate)
router.get('/:id', getUserbyId)
router.post('/', [userSchemaValidaton(userSchema), userExistValidaton], create)
router.put('/:id', [userNotExistValidaton], update)
router.delete('/:id', [userNotExistValidaton], remove)

export default router
