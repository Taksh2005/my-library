// app/book/[id]/page.tsx
import { prisma } from "@/lib/prisma"
import RequestButton from "./RequestButton"
import BookmarkButton from "./BookmarkButton"
import { getCurrentUser } from "@/app/actions/authActions"

export default async function BookDetail({ params }: { params: { id: string } }) {
  const bookId = parseInt(params.id)

  const book = await prisma.book.findUnique({
    where: { book_id: bookId },
    include: {
      category: true,
      BookRequest: { include: { user: true } },
      Bookmark: true,
      returns: true,
    },
  })

  if (!book) return <div className="p-6">Book not found</div>

  const user = await getCurrentUser()

  // defaults
  let initialBookmarked = false
  let alreadyRequested = false

  if (user) {
    const bookmark = await prisma.bookmark.findFirst({
      where: { user_id: user.id, book_id: bookId },
    })
    initialBookmarked = !!bookmark

    const request = await prisma.bookRequest.findFirst({
  where: { 
    user_id: user.id, 
    book_id: bookId,
    status: "PENDING", // only block if still pending
  },
})
alreadyRequested = !!request

  }

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow space-y-6">
      {/* Title and Author */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{book.book_title}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          by <span className="font-medium">{book.author}</span>
        </p>
      </div>

      {/* Metadata grid */}
      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <p><span className="font-semibold">Category:</span> {book.category.classname}</p>
        <p><span className="font-semibold">Publisher:</span> {book.publisher_name}</p>
        <p><span className="font-semibold">Publication:</span> {book.book_pub}</p>
        <p><span className="font-semibold">ISBN:</span> {book.ISBN}</p>
        <p><span className="font-semibold">Copyright Year:</span> {book.copyright_year}</p>
        <p><span className="font-semibold">Date Added:</span> {book.date_added.toDateString()}</p>
        <p><span className="font-semibold">Date Received:</span> {book.date_receiver.toDateString()}</p>
        <p><span className="font-semibold">Status:</span> 
          <span className={`ml-1 px-2 py-0.5 rounded text-xs ${
            book.status === "Available" 
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}>
            {book.status}
          </span>
        </p>
        <p><span className="font-semibold">Total Copies:</span> {book.book_copies}</p>
        <p><span className="font-semibold">Bookmarked By:</span> {book.Bookmark.length} users</p>
        <p><span className="font-semibold">Requested:</span> {book.BookRequest.length} times</p>
      </div>

      {/* User Actions */}
      {user && (
        <div className="flex gap-3 mt-4">
          <RequestButton bookId={book.book_id} alreadyRequested={alreadyRequested} />
          <BookmarkButton bookId={book.book_id} initialBookmarked={initialBookmarked} />
        </div>
      )}

      {/* Related requests (Admin can see who requested) */}
      {user?.role === "ADMIN" && book.BookRequest.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Requests</h2>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {book.BookRequest.map((req) => (
              <li key={req.request_id} className="py-2">
                {req.user?.username} ({req.user?.email}) – {req.status}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Return history */}
      {book.returns.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Return History</h2>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            {book.returns.map((ret) => (
              <li key={ret.borrow_detail_id} className="py-2">
                Returned on {ret.date_return.toDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
