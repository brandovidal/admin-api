import express from 'express'

import { find } from './controller'

const router = express.Router()

router.get('/', find)

// module.exports = router
export default router
