import { Router } from 'express'

// Schemas
import { findMembershipByIdSchema, findMembershipSchema, registerMembershipSchema, updateMembershipSchema } from './schema'

// Middlewarea
// import { deserializeUser } from '../../middlewares/deserializeUser'
import { validate } from '../../middlewares/validate'

// handler
import { create, getMembership, getMembershipById, getMemberships, remove, update } from './handler'

const router = Router()

// router.use(deserializeMembership)

router.get('/', getMemberships)
router.get('/membership', [validate(findMembershipSchema)], getMembership)
router.get('/:id', [validate(findMembershipByIdSchema)], getMembershipById)
router.post('/', [validate(registerMembershipSchema)], create)
router.put('/:id', [validate(updateMembershipSchema)], update)
router.delete('/:id', [validate(findMembershipByIdSchema)], remove)

export default router
