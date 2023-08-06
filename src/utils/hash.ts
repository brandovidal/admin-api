import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export async function generateHash(word: string) {
  return await bcrypt.hash(word, 12)
}

export async function compareHash(word: string, hash: string) {
  return await bcrypt.compare(word, hash)
}

export async function generateRandomCode() {
  const code = crypto.randomBytes(32).toString('hex')
  return (crypto.createHash('sha256').update(code).digest('hex'))
}
