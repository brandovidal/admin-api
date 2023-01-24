import { Router } from 'express'

// Schemas
import { postSchema } from './schema'

// Middlewarea
import { postSchemaValidaton, postExistValidaton, postNotExistValidaton } from '../../middlewares/post'

// handler
import { create, getPost, getPostbyId, getPosts, remove, update } from './handler'

const router = Router()

router.get('/', getPosts)
router.get('/post', getPost)
router.get('/:id', getPostbyId)
router.post('/', [postSchemaValidaton(postSchema), postExistValidaton], create)
router.put('/:id', [postNotExistValidaton], update)
router.delete('/:id', [postNotExistValidaton], remove)

export default router
