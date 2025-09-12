// app/page.tsx
import { getBooks } from "./actions/bookActions"
import ResourceCard from "@/app/components/ResourceCard"

export default async function Home({
  searchParams,
}: {
  searchParams: { search?: string; sortBy?: string; order?: string; categoryId?: string }
}) {
  const books = await getBooks({
    search: searchParams.search,
    sortBy: searchParams.sortBy as string,
    order: (searchParams.order as "asc" | "desc") || "asc",
    categoryId: searchParams.categoryId ? parseInt(searchParams.categoryId) : undefined,
  })

  return (
    <div className="p-6 space-y-4">
      {/* Search + Filter + Sort controls */}
      <form className="flex gap-2">
        <input
          type="text"
          name="search"
          placeholder="Search by title, publisher, ISBN..."
          className="border rounded p-2 dark:bg-gray-800 dark:text-white"
          defaultValue={searchParams.search || ""}
        />
        <select
          name="sortBy"
          className="border rounded p-2 dark:bg-gray-800 dark:text-white"
          defaultValue={searchParams.sortBy || "date_added"}
        >
          <option value="book_title">Title</option>
          <option value="publisher_name">Publisher</option>
          <option value="copyright_year">Year</option>
          <option value="date_added">Date Added</option>
        </select>
        <select
          name="order"
          className="border rounded p-2 dark:bg-gray-800 dark:text-white"
          defaultValue={searchParams.order || "asc"}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Apply
        </button>
      </form>

      {/* Book cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <ResourceCard key={book.book_id} book={book} />
        ))}
      </div>
    </div>
  )
}
