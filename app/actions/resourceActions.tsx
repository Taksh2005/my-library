"use server"

import { prisma } from "@/lib/prisma"

export type BookFormData = {
  book_title: string
  author: string
  publisher_name: string
  ISBN: string
  copyright_year: number
  category_id: number | null
  status: string
  book_copies: number
  book_pub: string
  date_receiver: string | Date
}

export async function getBooks() {
  return prisma.book.findMany({
    include: {
      category: true,
    },
  })
}

export async function addBook(data: BookFormData) {
  const { category_id, date_receiver, ...bookData } = data

  return prisma.book.create({
    data: {
      ...bookData,
      date_receiver: new Date(date_receiver),
      category: {
        connect: {
          category_id: Number(category_id),
        },
      },
    },
  })
}

export async function updateBook(
  id: number,
  data: BookFormData,
) {
  const {
    category_id,
    date_receiver,
    ...updateData
  } = data

  return prisma.book.update({
    where: {
      book_id: id,
    },
    data: {
      ...updateData,
      date_receiver: new Date(date_receiver),
      category: category_id
        ? {
            connect: {
              category_id: Number(category_id),
            },
          }
        : undefined,
    },
  })
}

export async function deleteBook(id: number) {
  return prisma.book.delete({
    where: {
      book_id: id,
    },
  })
}

export async function getCategories() {
  return prisma.category.findMany()
}

export async function addCategory(name: string) {
  return prisma.category.create({
    data: {
      classname: name,
    },
  })
}