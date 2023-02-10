import { Router } from 'express'

// Schemas
import { findStudentByIdSchema, findStudentSchema, registerStudentSchema, updateStudentSchema } from './schema'

// Middlewarea
// import { deserializeUser } from '../../middlewares/deserializeUser'
import { validate } from '../../middlewares/validate'

// handler
import { create, getStudent, getStudentById, getStudents, remove, update } from './handler'

const router = Router()

// router.use(deserializeStudent)

router.get('/', getStudents)
router.get('/student', [validate(findStudentSchema)], getStudent)
router.get('/:id', [validate(findStudentByIdSchema)], getStudentById)
router.post('/', [validate(registerStudentSchema)], create)
router.put('/:id', [validate(updateStudentSchema)], update)
router.delete('/:id', [validate(findStudentByIdSchema)], remove)

export default router
