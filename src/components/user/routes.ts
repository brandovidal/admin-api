import { Router } from 'express'

import { create, findAll, remove, update } from './controller'

const router = Router()

router.get('/', findAll)
router.post('/', create)
router.put('/:id', update)
router.delete('/:id', remove)

// module.exports = router
export default router
