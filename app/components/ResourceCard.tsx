// app/components/ResourceCard.tsx
"use client";

import Link from "next/link";
import { Book } from "@prisma/client";





export default function ResourceCard({ book }: { book: Book }) {
  const coverColors = [
  "#4285F4",
  "#DB4437",
  "#F4B400",
  "#0F9D58",
  "#7E57C2",
  "#00897B",
]

  const coverColor = coverColors[book.book_id % coverColors.length]
  return (
    <Link href={`/book/${book.book_id}`} className="group block">
      <article className="flex min-h-36 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
        {/* Small book thumbnail */}
        <div
  className="w-28 shrink-0 overflow-hidden sm:w-32"
  style={{ backgroundColor: coverColor }}
>
  <div className="flex h-full w-full items-center justify-center transition duration-200 group-hover:brightness-110">
    <svg
      className="h-12 w-12 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18s-3.332-.584-4.5 1.253"
      />
    </svg>
  </div>
</div>

        {/* Book information */}
        <div className="flex min-w-0 flex-1 items-center justify-between gap-4 px-5 py-4">
          <div className="min-w-0">
            <h2 className="line-clamp-2 text-base font-semibold leading-6 text-gray-900 transition group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
              {book.book_title}
            </h2>

            <p className="mt-1 line-clamp-1 text-sm text-gray-500 dark:text-gray-400">
              {book.publisher_name || "Unknown publisher"}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
              <span>Published {book.copyright_year}</span>
            </div>
          </div>

          {/* Arrow */}
          <div className="shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:bg-blue-950/40 dark:group-hover:text-blue-400">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9 5 7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
