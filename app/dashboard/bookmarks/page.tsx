import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/app/actions/authActions"
import Link from "next/link"

export default async function MyBookmarksPage() {
  const user = await getCurrentUser()
  if (!user) {
    return <div className="p-6">You must be logged in to view bookmarks.</div>
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { user_id: user.id },
    include: { book: true },
    orderBy: { createdAt: "desc" },
  })

  if (bookmarks.length === 0) {
    return <div className="p-6">You have no bookmarked books.</div>
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Bookmarks</h1>
      <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {bookmarks.map((bm) => (
          <li
            key={bm.bookmark_id}
            className="border p-4 rounded-lg shadow bg-white dark:bg-gray-900"
          >
            <h2 className="font-semibold text-lg mb-2">{bm.book.book_title}</h2>
            <p className="text-sm mb-1">Publisher: {bm.book.publisher_name}</p>
            <p className="text-sm mb-1">Year: {bm.book.copyright_year}</p>
            <Link
              href={`/book/${bm.book.book_id}`}
              className="text-blue-600 hover:underline text-sm"
            >
              View Details
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
