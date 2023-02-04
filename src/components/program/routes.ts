import { Router } from 'express'

// Schemas
import { registerProgramSchema, updateProgramSchema } from './schema'

// Middlewarea
import { userExistValidaton, userNotExistValidaton } from '../../middlewares/user'

// handler
import { create, getMe, getProgram, getProgrambyId, getPrograms, remove, update } from './handler'

// import { deserializeUser } from '../../middlewares/deserializeUser'
import { validate } from '../../middlewares/validate'

const router = Router()

// router.use(deserializeProgram)

router.get('/', getPrograms)
router.get('/user', getProgram)
router.get('/:id', getProgrambyId)
router.post('/', [validate(registerProgramSchema), userExistValidaton], create)
router.put('/:id', [validate(updateProgramSchema), userNotExistValidaton], update)
router.delete('/:id', [userNotExistValidaton], remove)

export default router
