// app/book/[id]/page.tsx
import { prisma } from "@/lib/prisma"
import RequestButton from "./RequestButton"
import BookmarkButton from "./BookmarkButton"
import { getCurrentUser } from "@/app/actions/authActions"

export default async function BookDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const bookId = parseInt(id)

  const book = await prisma.book.findUnique({
    where: { book_id: bookId },
    include: {
      category: true,
      BookRequest: { include: { user: true } },
      Bookmark: true,
      returns: true,
    },
  })

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Book not found
          </h1>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            The book you're looking for doesn't exist or has been removed.
          </p>

          <a
            href="/"
            className="mt-6 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            ← Back to library
          </a>
        </div>
      </div>
    )
  }

  const user = await getCurrentUser()

  let initialBookmarked = false
  let alreadyRequested = false

  if (user) {
    const bookmark = await prisma.bookmark.findFirst({
      where: {
        user_id: user.id,
        book_id: bookId,
      },
    })

    initialBookmarked = !!bookmark

    const request = await prisma.bookRequest.findFirst({
      where: {
        user_id: user.id,
        book_id: bookId,
        status: "PENDING",
      },
    })

    alreadyRequested = !!request
  }

  const isAvailable = book.status === "Available"

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Back button */}
        <a
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to library
        </a>

        {/* Main book card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-8 sm:px-8 dark:border-gray-800">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

              <div className="flex gap-5">

                {/* Book icon */}
                <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-blue-50 sm:flex dark:bg-blue-950/40">
                  <svg
                    className="h-10 w-10 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332-.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>

                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                      {book.category.classname}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        isAvailable
                          ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                          : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                      }`}
                    >
                      <span className="mr-1.5">●</span>
                      {book.status}
                    </span>
                  </div>

                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                    {book.book_title}
                  </h1>

                  <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                    by{" "}
                    <span className="font-medium text-gray-900 dark:text-gray-200">
                      {book.author}
                    </span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              {user && (
                <div className="flex shrink-0 gap-3">
                  <RequestButton
                    bookId={book.book_id}
                    alreadyRequested={alreadyRequested}
                  />

                  <BookmarkButton
                    bookId={book.book_id}
                    initialBookmarked={initialBookmarked}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Book information */}
          <div className="px-6 py-8 sm:px-8">

            <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
              Book Information
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {/* Publisher */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Publisher
                </p>
                <p className="mt-1.5 font-medium text-gray-900 dark:text-white">
                  {book.publisher_name}
                </p>
              </div>

              {/* Publication */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Publication
                </p>
                <p className="mt-1.5 font-medium text-gray-900 dark:text-white">
                  {book.book_pub}
                </p>
              </div>

              {/* ISBN */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  ISBN
                </p>
                <p className="mt-1.5 font-mono text-sm font-medium text-gray-900 dark:text-white">
                  {book.ISBN}
                </p>
              </div>

              {/* Copyright */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Copyright Year
                </p>
                <p className="mt-1.5 font-medium text-gray-900 dark:text-white">
                  {book.copyright_year}
                </p>
              </div>

              {/* Copies */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Total Copies
                </p>
                <p className="mt-1.5 font-medium text-gray-900 dark:text-white">
                  {book.book_copies}
                </p>
              </div>

              {/* Added */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Added to Library
                </p>
                <p className="mt-1.5 font-medium text-gray-900 dark:text-white">
                  {book.date_added.toDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="border-t border-gray-200 px-6 py-6 sm:px-8 dark:border-gray-800">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">

              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {book.Bookmark.length}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Bookmarks
                </p>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {book.BookRequest.length}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Requests
                </p>
              </div>

              <div className="col-span-2 text-center md:col-span-1">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {book.returns.length}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Returns
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Admin Requests */}
        {user?.role === "ADMIN" && book.BookRequest.length > 0 && (
          <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

            <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Book Requests
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Users who have requested this book
                  </p>
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {book.BookRequest.length}
                </span>
              </div>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {book.BookRequest.map((req) => (
                <div
                  key={req.request_id}
                  className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {req.user?.username || "Unknown user"}
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {req.user?.email || "No email"}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                      req.status === "PENDING"
                        ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400"
                        : req.status === "APPROVED"
                        ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                        : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Return History */}
        {book.returns.length > 0 && (
          <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

            <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Return History
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Previous return records for this book
              </p>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {book.returns.map((ret) => (
                <div
                  key={ret.borrow_detail_id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 dark:bg-green-950/40">
                      <svg
                        className="h-5 w-5 text-green-600 dark:text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Book returned
                      </p>

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {ret.date_return.toDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer information */}
        <div className="mt-6 text-center text-xs text-gray-400 dark:text-gray-600">
          Received on {book.date_receiver.toDateString()}
        </div>

      </div>
    </main>
  )
}