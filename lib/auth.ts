import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-secret-key-change-in-production"

export interface AuthUser {
  id: string
  email: string
  role: string
}

export function generateToken(user: AuthUser): string {
  console.log("Generating token for user:", user.email)
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser
    console.log("Token verified for user:", decoded.email)
    return decoded
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

export function getAuthUser(request: NextRequest): AuthUser | null {
  const token = request.cookies.get("auth-token")?.value
  console.log("Getting auth user, token exists:", !!token)
  if (!token) return null
  return verifyToken(token)
}
