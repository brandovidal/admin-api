import express from 'express'

import { create, find, update } from './controller'

const router = express.Router()

router.get('/', find)
router.post('/', create)
router.put('/:id', update)

// module.exports = router
export default router
