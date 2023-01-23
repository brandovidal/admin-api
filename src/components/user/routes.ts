import { Router } from 'express'

// Controllers
import { create, findAll, remove, update } from './controller'

// Schemas
import { userSchema } from './schema'

// Middlewarea
import { userSchemaValidaton } from './middlewares/schema-validation'
import { userExistValidaton } from './middlewares/user-exist'
import { userNotExistValidaton } from './middlewares/user-not-exist'

const router = Router()

router.get('/', findAll)
router.post('/', [userSchemaValidaton(userSchema), userExistValidaton], create)
router.put('/:id', [userNotExistValidaton], update)
router.delete('/:id', [userNotExistValidaton], remove)

export default router
