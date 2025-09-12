"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "./authActions"
import { redirect } from "next/navigation"

// Toggle bookmark (add/remove)
export async function toggleBookmark(bookId: number) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  // Check if bookmark already exists
  const existing = await prisma.bookmark.findFirst({
    where: { user_id: user.id, book_id: bookId },
  })

  if (existing) {
    // Remove bookmark
    await prisma.bookmark.delete({
      where: { bookmark_id: existing.bookmark_id },
    })
    return { bookmarked: false }
  } else {
    // Add bookmark
    await prisma.bookmark.create({
      data: { user_id: user.id, book_id: bookId },
    })
    return { bookmarked: true }
  }
}

// Get all bookmarks for current user
export async function getUserBookmarks() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  return prisma.bookmark.findMany({
    where: { user_id: user.id },
    include: { book: true },
    orderBy: { createdAt: "desc" },
  })
}
