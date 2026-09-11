// app/actions/adminActions.ts
"use server"

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function approveRequest(requestId: number) {
  const request = await prisma.bookRequest.findUnique({
    where: { request_id: requestId },
  })

  if (!request) redirect('/dashboard')

  // create borrow entry
  await prisma.bookissuancedetail.create({
    data: {
      user_id: request.user_id,
      date_borrow: new Date(),
      due_date: new Date(new Date().setDate(new Date().getDate() + 14)),
    },
  })

  // optionally decrement copies
  await prisma.book.update({
    where: { book_id: request.book_id },
    data: { book_copies: { decrement: 1 } },
  })
}
export async function getActiveBorrows() {
  const borrows = await prisma.bookissuancedetail.findMany({
    include: {
      user: {
        include: {
          BookRequest: {
            include: {
              book: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
      returns: true,
    },
  })

  return borrows
    .filter((b) => b.returns.length === 0)
    .map((b) => ({
      ...b,
      book: b.user.BookRequest[0]?.book ?? null,
    }))
}
export async function markBookReturned(borrowId: number, bookId: number) {
  await prisma.bookreturndetail.create({
    data: {
      borrow_id: borrowId,
      book_id: bookId,
      borrow_status: "RETURNED",
      date_return: new Date(),
    },
  })

  // increment copies back
  await prisma.book.update({
    where: { book_id: bookId },
    data: { book_copies: { increment: 1 } },
  });
  redirect('/dashboard/borrowed-books');
}
