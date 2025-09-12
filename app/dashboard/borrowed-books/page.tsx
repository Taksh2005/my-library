import { getActiveBorrows, markBookReturned } from "@/app/actions/adminActions"

export default async function BorrowedBooksPage() {
  const borrows = await getActiveBorrows()

  if (borrows.length === 0) {
    return <div className="p-6">No active borrows 🎉</div>
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Borrowed Books</h1>
      <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="border p-2">Book</th>
            <th className="border p-2">Borrower</th>
            <th className="border p-2">Borrow Date</th>
            <th className="border p-2">Due Date</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {borrows.map(b => (
            <tr key={b.borrow_id}>
              <td className="border p-2">{/* fetch book title */}</td>
              <td className="border p-2">{b.user.firstname} {b.user.lastname}</td>
              <td className="border p-2">{new Date(b.date_borrow).toDateString()}</td>
              <td className="border p-2">{new Date(b.due_date).toDateString()}</td>
              <td className="border p-2">
                <form action={async () => {
                  "use server"
                  await markBookReturned(b.borrow_id, /* book_id needed here */ 1)
                }}>
                  <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                    Mark Returned
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
