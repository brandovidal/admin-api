import { LocationModel } from './location'

export interface UserModel {
  id?: string
  email: string
  dateOfBirth: Date | string
  name: string
  location?: LocationModel
  createdAt?: Date | string
  updatedAt?: Date | string
}
