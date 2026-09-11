"use client"

import { toggleBookmark } from "@/app/actions/bookmarkActions"
import { useState, useTransition } from "react"

export default function BookmarkButton({
  bookId,
  initialBookmarked,
}: {
  bookId: number
  initialBookmarked: boolean
}) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          const result = await toggleBookmark(bookId)
          setBookmarked(result.bookmarked)
        })
      }
      disabled={isPending}
      title={bookmarked ? "Remove bookmark" : "Save for later"}
      aria-label={bookmarked ? "Remove bookmark" : "Save for later"}
      className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
        bookmarked
          ? "border-yellow-200 bg-yellow-50 text-yellow-600 dark:border-yellow-900 dark:bg-yellow-950/40 dark:text-yellow-400"
          : "border-gray-200 bg-white text-gray-600 hover:border-yellow-300 hover:bg-yellow-50 hover:text-yellow-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-yellow-800 dark:hover:bg-yellow-950/40 dark:hover:text-yellow-400"
      } disabled:cursor-not-allowed disabled:opacity-70`}
    >
      {isPending ? (
        <svg
          className="h-5 w-5 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M21 12a9 9 0 0 1-9 9v-2a7 7 0 0 0 7-7h2Z"
          />
        </svg>
      ) : (
        <svg
          className="h-5 w-5"
          fill={bookmarked ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M5 5.5A2.5 2.5 0 0 1 7.5 3h9A2.5 2.5 0 0 1 19 5.5V21l-7-4-7 4V5.5Z"
          />
        </svg>
      )}
    </button>
  )
}