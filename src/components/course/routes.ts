import { Router } from 'express'

// Schemas
import { findCourseByIdSchema, findCourseSchema, registerCourseSchema, updateCourseSchema } from './schema'

// Middlewarea
// import { deserializeUser } from '../../middlewares/deserializeUser'
import { validate } from '../../middlewares/validate'

// handler
import { create, getCourse, getCourseById, getCourses, remove, update } from './handler'

const router = Router()

// router.use(deserializeCourse)

router.get('/', getCourses)
router.get('/course', [validate(findCourseSchema)], getCourse)
router.get('/:id', [validate(findCourseByIdSchema)], getCourseById)
router.post('/', [validate(registerCourseSchema)], create)
router.put('/:id', [validate(updateCourseSchema)], update)
router.delete('/:id', remove)

export default router
