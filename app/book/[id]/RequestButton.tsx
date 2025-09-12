"use client"

import { requestBook } from "@/app/actions/bookRequestActions"
import { useTransition, useState } from "react"

export default function RequestButton({
  bookId,
  alreadyRequested,
}: {
  bookId: number
  alreadyRequested: boolean
}) {
  const [requested, setRequested] = useState(alreadyRequested)
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          await requestBook(bookId)
          setRequested(true)
        })
      }
      className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded disabled:opacity-50"
      disabled={isPending || requested}
    >
      {requested ? "Request Sent ✓" : isPending ? "Requesting..." : "Request Issue"}
    </button>
  )
}
