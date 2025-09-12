// app/actions/bookActions.tsx
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
