import { Router } from 'express'

// Schemas
import { findEnrollmentByIdSchema, findEnrollmentSchema, registerEnrollmentSchema, updateEnrollmentSchema } from './schema'

// Middlewarea
// import { deserializeUser } from '../../middlewares/deserializeUser'
import { validate } from '../../middlewares/validate'

// handler
import { create, getEnrollment, getEnrollmentById, getEnrollments, remove, update } from './handler'

const router = Router()

// router.use(deserializeEnrollment)

router.get('/', getEnrollments)
router.get('/enrollment', [validate(findEnrollmentSchema)], getEnrollment)
router.get('/:id', [validate(findEnrollmentByIdSchema)], getEnrollmentById)
router.post('/', [validate(registerEnrollmentSchema)], create)
router.put('/:id', [validate(updateEnrollmentSchema)], update)
router.delete('/:id', [validate(findEnrollmentByIdSchema)], remove)

export default router
