import express from 'express'

import { create, find } from './controller'

const router = express.Router()

router.get('/', find)
router.post('/', create)
router.put('/', create)

// module.exports = router
export default router
