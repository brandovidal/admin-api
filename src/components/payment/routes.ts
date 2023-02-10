import { Router } from 'express'

// Schemas
import { findPaymentByIdSchema, findPaymentSchema, registerPaymentSchema, updatePaymentSchema } from './schema'

// Middlewarea
// import { deserializeUser } from '../../middlewares/deserializeUser'
import { validate } from '../../middlewares/validate'

// handler
import { create, getPayment, getPaymentById, getPayments, remove, update } from './handler'

const router = Router()

// router.use(deserializePayment)

router.get('/', getPayments)
router.get('/payment', [validate(findPaymentSchema)], getPayment)
router.get('/:id', [validate(findPaymentByIdSchema)], getPaymentById)
router.post('/', [validate(registerPaymentSchema)], create)
router.put('/:id', [validate(updatePaymentSchema)], update)
router.delete('/:id', [validate(findPaymentByIdSchema)], remove)

export default router
