"use server"

import { prisma } from "@/lib/prisma"

export async function getBooks() {
  return prisma.book.findMany({ include: { category: true } })
}

export async function addBook(data: any) {
  return prisma.book.create({ data })
}

export async function updateBook(id: number, data: any) {
  const { book_id, category_id, ...updateData } = data

  return prisma.book.update({
    where: { book_id: id },
    data: {
      ...updateData,
      category: category_id
        ? { connect: { category_id } }
        : undefined, // don’t change if not provided
    },
  })
}

export async function deleteBook(id: number) {
  return prisma.book.delete({ where: { book_id: id } })
}

export async function getCategories() {
  return prisma.category.findMany()
}

export async function addCategory(name: string) {
  return prisma.category.create({ data: { classname: name } })
}
