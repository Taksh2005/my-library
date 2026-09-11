// app/page.tsx
import { getBooks } from "./actions/bookActions"
import ResourceCard from "@/app/components/ResourceCard"

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string
    sortBy?: string
    order?: string
    categoryId?: string
  }>
}) {
  const params = await searchParams

  const books = await getBooks({
    search: params.search,
    sortBy: params.sortBy as string,
    order: (params.order as "asc" | "desc") || "asc",
    categoryId: params.categoryId
      ? parseInt(params.categoryId)
      : undefined,
  })

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth={1.7}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"
                />
              </svg>
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Library
              </h1>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Browse, discover, and request books from the library.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <form className="mb-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col gap-3 lg:flex-row">

            {/* Search */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth={1.8}
                    d="m21 21-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
                  />
                </svg>
              </div>

              <input
                type="text"
                name="search"
                placeholder="Search by title, author, publisher, ISBN..."
                defaultValue={params.search || ""}
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
              />
            </div>

            {/* Sort By */}
            <select
              name="sortBy"
              defaultValue={params.sortBy || "date_added"}
              className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="date_added">Recently Added</option>
              <option value="book_title">Title</option>
              <option value="publisher_name">Publisher</option>
              <option value="copyright_year">Year</option>
            </select>

            {/* Order */}
            <select
              name="order"
              defaultValue={params.order || "asc"}
              className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>

            {/* Apply */}
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth={2}
                  d="M3 4h18M6 10h12M10 16h4M11 21h2"
                />
              </svg>
              Apply
            </button>
          </div>
        </form>

        {/* Results Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Available Books
            </h2>

            {params.search ? (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Showing results for{" "}
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  "{params.search}"
                </span>
              </p>
            ) : (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Explore the library collection
              </p>
            )}
          </div>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {books.length} {books.length === 1 ? "book" : "books"}
          </span>
        </div>

        {/* Books */}
        {books.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
  {books.map((book) => (
    <ResourceCard key={book.book_id} book={book} />
  ))}
</div>
        ) : (
          /* Empty State */
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <svg
                className="h-8 w-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.584-4.5 1.253"
                />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              No books found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
              {params.search
                ? "We couldn't find any books matching your search. Try a different title, author, publisher, or ISBN."
                : "There are currently no books available in the library."}
            </p>

            {params.search && (
              <a
                href="/"
                className="mt-5 inline-flex items-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Clear search
              </a>
            )}
          </div>
        )}

      </div>
    </main>
  )
}
