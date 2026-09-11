import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/app/actions/authActions"
import Link from "next/link"

export default async function MyBookmarksPage() {
  const user = await getCurrentUser()

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth={1.7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v17l-4-2-4 2-4-2-2 1V5.5Z"
                />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Login required
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Please log in to view your bookmarked books.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-flex items-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { user_id: user.id },
    include: { book: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <svg
                className="h-5.5 w-5.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth={1.7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v17l-4-2-4 2-4-2-2 1V5.5Z"
                />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                My Bookmarks
              </h1>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                Books you&apos;ve saved for later
              </p>
            </div>
          </div>

          <div className="mt-5 h-px bg-gray-200 dark:bg-gray-800" />
        </div>

        {bookmarks.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v17l-4-2-4 2-4-2-2 1V5.5Z"
                />
              </svg>
            </div>

            <h2 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">
              No bookmarks yet
            </h2>

            <p className="mx-auto mt-1 max-w-md text-sm text-gray-500 dark:text-gray-400">
              Save books you are interested in and they will appear here.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Browse Books
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14m-6-6 6 6-6 6"
                />
              </svg>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {bookmarks.length}{" "}
                {bookmarks.length === 1 ? "book" : "books"} saved
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {bookmarks.map((bm: (typeof bookmarks)[number]) => (
                <Link
                  key={bm.bookmark_id}
                  href={`/book/${bm.book.book_id}`}
                  className="group block"
                >
                  <article className="flex min-h-36 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
                    <div className="flex w-24 shrink-0 items-center justify-center bg-gray-100 dark:bg-gray-800 sm:w-28">
                      <div className="flex h-20 w-14 items-center justify-center rounded-md bg-blue-600 text-white shadow-sm transition duration-200 group-hover:scale-105">
                        <svg
                          className="h-7 w-7"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeWidth={1.7}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 4.75A1.75 1.75 0 0 1 7.75 3H19v17H7.75A1.75 1.75 0 0 1 6 18.25V4.75ZM6 18.25A1.75 1.75 0 0 1 7.75 16H19"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="flex min-w-0 flex-1 items-center justify-between gap-4 px-4 py-4 sm:px-5">
                      <div className="min-w-0">
                        <h2 className="line-clamp-2 text-base font-semibold text-gray-900 transition group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                          {bm.book.book_title}
                        </h2>

                        <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
                          {bm.book.publisher_name || "Unknown publisher"}
                        </p>

                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                          <span>{bm.book.copyright_year}</span>
                          <span>•</span>
                          <span>Book ID: {bm.book.book_id}</span>
                        </div>
                      </div>

                      <div className="shrink-0 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600 dark:text-gray-600 dark:group-hover:text-blue-400">
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
                  </article>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}