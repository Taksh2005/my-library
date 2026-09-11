"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { getCurrentUser } from "./authActions"
import { redirect } from "next/navigation"

export type UserFormData = {
  username: string
  email: string
  password?: string
  firstname: string
  lastname: string
  role: string
}

export async function getUsers() {
  return prisma.user.findMany({
    select: {
      user_id: true,
      username: true,
      email: true,
      firstname: true,
      lastname: true,
      role: true,
    },
  })
}

export async function addUser(data: UserFormData) {
  if (!data.password) {
    throw new Error("Password is required")
  }

  const hashedPassword = await bcrypt.hash(data.password, 10)

  return prisma.user.create({
    data: {
      username: data.username,
      email: data.email || null,
      password: hashedPassword,
      firstname: data.firstname,
      lastname: data.lastname,
      role: data.role || "USER",
    },
  })
}

export async function updateUser(
  id: number,
  data: UserFormData,
) {
  return prisma.user.update({
    where: {
      user_id: id,
    },
    data: {
      username: data.username,
      email: data.email || null,
      firstname: data.firstname,
      lastname: data.lastname,
      role: data.role,
    },
  })
}

export async function deleteUser(id: number) {
  return prisma.user.delete({
    where: {
      user_id: id,
    },
  })
}

export async function getProfile() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  return prisma.user.findUnique({
    where: {
      user_id: user.id,
    },
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

  if (!user) {
    redirect("/login")
  }

  return prisma.user.update({
    where: {
      user_id: user.id,
    },
    data,
  })
}