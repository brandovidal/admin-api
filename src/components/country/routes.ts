import { Router } from 'express'

// Schemas
import { findCountryByIdSchema, findCountrySchema, registerCountrySchema, updateCountrySchema } from './schema'

// Middlewarea
// import { deserializeUser } from '../../middlewares/deserializeUser'
import { validate } from '../../middlewares/validate'

// handler
import { create, getCountry, getCountryById, getCountries, remove, update } from './handler'

const router = Router()

// router.use(deserializeCountry)

router.get('/', getCountries)
router.get('/country', [validate(findCountrySchema)], getCountry)
router.get('/:id', [validate(findCountryByIdSchema)], getCountryById)
router.post('/', [validate(registerCountrySchema)], create)
router.put('/:id', [validate(updateCountrySchema)], update)
router.delete('/:id', [validate(findCountryByIdSchema)], remove)

export default router
