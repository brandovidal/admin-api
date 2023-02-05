import { Router } from 'express'

// Schemas
import { findProgramByIdSchema, findProgramSchema, registerProgramSchema, updateProgramSchema } from './schema'

// Middlewarea
// import { deserializeUser } from '../../middlewares/deserializeUser'
import { validate } from '../../middlewares/validate'

// handler
import { create, getProgram, getProgramById, getPrograms, remove, update } from './handler'

const router = Router()

// router.use(deserializeProgram)

router.get('/', getPrograms)
router.get('/program', [validate(findProgramSchema)], getProgram)
router.get('/:id', [validate(findProgramByIdSchema)], getProgramById)
router.post('/', [validate(registerProgramSchema)], create)
router.put('/:id', [validate(updateProgramSchema)], update)
router.delete('/:id', remove)

export default router
