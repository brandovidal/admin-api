import request from 'supertest'

import { app } from '../src/index'

export const server = request(app)
