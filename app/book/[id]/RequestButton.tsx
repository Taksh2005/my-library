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

  function handleRequest() {
    if (requested || isPending) return

    startTransition(async () => {
      await requestBook(bookId)
      setRequested(true)
    })
  }

  return (
    <button
      onClick={handleRequest}
      disabled={isPending || requested}
      title={
        requested
          ? "Request sent"
          : isPending
            ? "Requesting..."
            : "Request issue"
      }
      aria-label={
        requested
          ? "Request sent"
          : isPending
            ? "Requesting"
            : "Request issue"
      }
      className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
        requested
          ? "border-green-200 bg-green-50 text-green-600 dark:border-green-900 dark:bg-green-950/40 dark:text-green-400"
          : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-blue-800 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
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
      ) : requested ? (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m5 12 4 4L19 6"
          />
        </svg>
      ) : (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M12 6v12m6-6H6"
          />
        </svg>
      )}
    </button>
  )
}