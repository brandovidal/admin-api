import { Router } from 'express'

// Schemas
import { findCertificateByIdSchema, findCertificateSchema, registerCertificateSchema, updateCertificateSchema } from './schema'

// Middlewarea
// import { deserializeUser } from '../../middlewares/deserializeUser'
import { validate } from '../../middlewares/validate'

// handler
import { create, getCertificate, getCertificateById, getCertificates, remove, update } from './handler'

const router = Router()

// router.use(deserializeCertificate)

router.get('/', getCertificates)
router.get('/certificate', [validate(findCertificateSchema)], getCertificate)
router.get('/:id', [validate(findCertificateByIdSchema)], getCertificateById)
router.post('/', [validate(registerCertificateSchema)], create)
router.put('/:id', [validate(updateCertificateSchema)], update)
router.delete('/:id', [validate(findCertificateByIdSchema)], remove)

export default router
