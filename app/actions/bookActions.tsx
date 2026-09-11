// app/actions/bookActions.tsx
'use server'

import {prisma} from "@/lib/prisma";
import { getCurrentUser } from "./authActions"
import { redirect } from "next/navigation";

export async function getBooks({
  search,
  sortBy,
  order,
  categoryId,
}: {
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  categoryId?: number;
}) {
  const conditions: any[] = [];

  if (search) {
    conditions.push({
      OR: [
        { book_title: { contains: search } },  // removed mode
        { publisher_name: { contains: search } },
        { ISBN: { contains: search } },
      ],
    });
  }

  if (categoryId) {
    conditions.push({ category_id: categoryId });
  }

  return prisma.book.findMany({
    where: conditions.length > 0 ? { AND: conditions } : undefined,
    orderBy: sortBy ? { [sortBy]: order } : { date_added: "desc" },
  });
}


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

export async function searchBooks(query: string) {
  try {
    const search = query.trim()

    if (!search) {
      return []
    }

    const books = await prisma.book.findMany({
      where: {
        OR: [
          {
            book_title: {
              contains: search,
            },
          },
          {
            author: {
              contains: search,
            },
          },
          {
            publisher_name: {
              contains: search,
            },
          },
          {
            ISBN: {
              contains: search,
            },
          },
        ],
      },
      select: {
        book_id: true,
        book_title: true,
        author: true,
        publisher_name: true,
        ISBN: true,
        copyright_year: true,
      },
      orderBy: {
        book_title: "asc",
      },
      take: 5,
    })

    return books
  } catch (error) {
    console.error("Navbar book search failed:", error)
    return []
  }
}