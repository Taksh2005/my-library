"use server"
import {prisma} from "@/lib/prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"

export async function registerUser(data: {
  username: string
  email?: string
  password: string
  firstname: string
  lastname: string
}) {
  const hashed = await bcrypt.hash(data.password, 10)
  const user = await prisma.user.create({
    data: { ...data, password: hashed }
  })

  const token = jwt.sign(
    { id: user.user_id, role: user.role, firstname: user.firstname },
    JWT_SECRET,
    { expiresIn: "1d" }
  )

  const cookieStore = await cookies()
  cookieStore.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24
  })

  return { success: true, user }
}

export async function loginUser(data: { username: string; password: string }) {
  const user = await prisma.user.findUnique({
    where: { username: data.username }
  })
  if (!user) return { success: false, message: "User not found" }

  const valid = await bcrypt.compare(data.password, user.password)
  if (!valid) return { success: false, message: "Invalid password" }

  const token = jwt.sign(
    { id: user.user_id, role: user.role, firstname: user.firstname },
    JWT_SECRET,
    { expiresIn: "1d" }
  )

  const cookieStore = await cookies()
  cookieStore.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24
  })

  return { success: true, user }
}

export async function logoutUser() {
  const cookieStore = await cookies()
  cookieStore.delete("token")
  return;
}
type JwtPayload = {
  id: number
  role: string
  firstname: string
}
export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  if (!token) return null
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    return { id: decoded.id, role: decoded.role, firstname: decoded.firstname }
  } catch {
    return null
  }
}
export async function getAllBookRequests() {
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") redirect('/login')

  return prisma.bookRequest.findMany({
    include: { user: true, book: true },
    orderBy: { createdAt: "desc" },
  })
}

export async function updateBookRequestStatus(
  requestId: number,
  status: "APPROVED" | "REJECTED"
) {
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") redirect('/login')

  return prisma.bookRequest.update({
    where: { request_id: requestId },
    data: { status },
  })
}