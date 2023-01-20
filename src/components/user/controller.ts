import { Request, Response } from 'express'

import { error, success } from '../../utils/message'

import { createUser, findUser, removeUser, updateUser } from './service'

// Find all users
export const find = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await findUser()
    const result = success(users)
    res.json(result)
  } catch (err: any) {
    console.error(err)

    const result = error(err.code, err.message)
    res.json(result)
  }
}

// create user
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const createdUser = await createUser(req)
    const result = success(createdUser)
    res.json(result)
  } catch (err: any) {
    console.error(err)

    const result = error(err.code, err.message)
    res.json(result)
  }
}

// update user
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedUser = await updateUser(req)
    const result = success(updatedUser)
    res.json(result)
  } catch (err: any) {
    console.error(err)

    const result = error(err.code, err.message)
    res.json(result)
  }
}

// delete user
export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedUser = await removeUser(req)
    const result = success({ message: `User ${deletedUser.name} deleted successfully` })
    res.json(result)
  } catch (err: any) {
    console.error(err)

    const result = error(err.code, err.message)
    res.json(result)
  }
}
