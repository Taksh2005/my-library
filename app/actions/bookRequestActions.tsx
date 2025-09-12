// app/actions/bookRequestActions.ts
"use server"

import {prisma} from "@/lib/prisma"
import { getCurrentUser } from "./authActions"
import { redirect } from "next/navigation"
import { approveRequest } from "./adminActions"

export async function requestBook(bookId: number) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  return prisma.bookRequest.create({
    data: {
      user_id: user.id,
      book_id: bookId,
    },
  })
}

export async function bookmarkBook(bookId: number) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  return prisma.bookmark.create({
    data: {
      user_id: user.id,
      book_id: bookId,
    },
  })
}

export async function getAllBookRequests() {
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") redirect('/login')

  return prisma.bookRequest.findMany({
    include: {
      user: true, // since we removed member, use user
      book: true,
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function updateBookRequestStatus(
  requestId: number,
  status: "APPROVED" | "REJECTED"
) {
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") redirect('/login')
  if(status=="APPROVED"){
    approveRequest(requestId)
  }
  return prisma.bookRequest.update({
    where: { request_id: requestId },
    data: { status },
  })
}