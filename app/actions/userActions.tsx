"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { getCurrentUser } from "./authActions"
import { redirect } from "next/navigation"

export async function getUsers() {
  return prisma.user.findMany()
}

export async function addUser(data: any) {
  const hashedPassword = await bcrypt.hash(data.password, 10)
  return prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: hashedPassword,
      firstname: data.firstname,
      lastname: data.lastname,
      role: data.role || "USER",
    },
  })
}

export async function updateUser(id: number, data: any) {
  return prisma.user.update({
    where: { user_id: id },
    data: {
      username: data.username,
      email: data.email,
      firstname: data.firstname,
      lastname: data.lastname,
      role: data.role,
    },
  })
}

export async function deleteUser(id: number) {
  return prisma.user.delete({ where: { user_id: id } })
}

export async function getProfile() {
  const user = await getCurrentUser()
  if (!user) return null

  return prisma.user.findUnique({
    where: { user_id: user.id },
    select: {
      firstname: true,
      lastname: true,
      email: true,
      username: true,
    },
  })
}

export async function updateProfile(data: {
  firstname: string
  lastname: string
  email: string
  username: string
}) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  return prisma.user.update({
    where: { user_id: user.id },
    data,
  })
}