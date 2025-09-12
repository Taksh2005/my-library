// app/components/ResourceCard.tsx
"use client"

import Link from "next/link"
import { Book } from "@prisma/client"

export default function ResourceCard({ book }: { book: Book }) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white dark:bg-gray-800 dark:text-white">
      <h2 className="text-lg font-semibold">{book.book_title}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {book.publisher_name} ({book.copyright_year})
      </p>
      <Link
        href={`/book/${book.book_id}`}
        className="mt-2 inline-block text-blue-600 dark:text-blue-400 hover:underline"
      >
        View Details →
      </Link>
    </div>
  )
}
