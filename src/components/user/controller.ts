import { PrismaClient } from '@prisma/client'

import { Request, Response } from 'express'

// import { ResponseVO } from '../../model/vo/responseVo'
import { error, success } from '../../utils/message'

const prisma = new PrismaClient()

// Find all users
export const find = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany()
    console.log('🚀 ~ file: controller.ts:15 ~ find ~ users', users)

    const result = success(users)
    res.json(result)
  } catch (err: any) {
    console.error(err)

    const result = error(err.code, err.message)
    res.json(result)
  }
}
