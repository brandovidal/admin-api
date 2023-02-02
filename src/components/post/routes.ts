import { Router } from 'express'

// Schemas
import { registerPostSchema, updateUserSchema } from './schema'

// Middlewarea
import { userNotExistValidaton, postNotExistValidaton, postExistValidaton } from '../../middlewares/post'
import { validate } from '../../middlewares/validate'

// handler
import { create, getPost, getPostbyId, getPosts, remove, update } from './handler'

const router = Router()

router.get('/', getPosts)
router.get('/post', getPost)
router.get('/:id', getPostbyId)
router.post('/', [validate(registerPostSchema), userNotExistValidaton, postExistValidaton], create)
router.put('/:id', [validate(updateUserSchema), postNotExistValidaton], update)
router.delete('/:id', [postNotExistValidaton], remove)

export default router
