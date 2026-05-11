import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

const SECRET = process.env.ADMIN_JWT_SECRET || 'admin-secret-change-this'

export function signAdminToken(payload: { id: number; email: string }) {
  return jwt.sign(payload, SECRET, { expiresIn: '8h' })
}

export function verifyAdminToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as { id: number; email: string }
  } catch {
    return null
  }
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function getAdminFromCookies() {
  const token = cookies().get('admin_token')?.value
  if (!token) return null
  return verifyAdminToken(token)
}
