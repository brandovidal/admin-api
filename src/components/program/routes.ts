import { Router } from 'express'

// Schemas
import { registerProgramSchema, updateProgramSchema } from './schema'

// Middlewarea
// import { deserializeUser } from '../../middlewares/deserializeUser'
import { validate } from '../../middlewares/validate'

// handler
import { create, getMe, getProgram, getProgrambyId, getPrograms, remove, update } from './handler'

const router = Router()

// router.use(deserializeProgram)

router.get('/', getPrograms)
router.get('/user', getProgram)
router.get('/:id', getProgrambyId)
router.post('/', [validate(registerProgramSchema)], create)
router.put('/:id', [validate(updateProgramSchema)], update)
router.delete('/:id', remove)

export default router
