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
      className="px-4 py-2 bg-yellow-500 dark:bg-yellow-600 text-white rounded disabled:opacity-50"
      disabled={isPending}
    >
      {bookmarked ? "Bookmarked ✓" : "Save for Later"}
    </button>
  )
}
