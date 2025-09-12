import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/app/actions/authActions"

export default async function MyBorrowsPage() {
  const user = await getCurrentUser()
  if (!user) {
    return <div className="p-6">Please log in to view borrowed books.</div>
  }

  // Fetch borrowed books that haven't been returned
  const borrows = await prisma.bookissuancedetail.findMany({
  where: {
    user_id: user.id,
    returns: {
      none: {}, // means: no return record exists → still borrowed
    },
  },
  include: {
    user: true,
  },
  orderBy: { date_borrow: "desc" },
})


  if (borrows.length === 0) {
    return <div className="p-6">You have not borrowed any books yet.</div>
  }

  const today = new Date()

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">My Borrowed Books</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="p-2 text-left">Borrow_ID</th>
            <th className="p-2 text-left">Borrowed On</th>
            <th className="p-2 text-left">Due Date</th>
            <th className="p-2 text-left">Fine</th>
          </tr>
        </thead>
        <tbody>
          {borrows.map((borrow) => {
            const dueDate = new Date(borrow.due_date)
            const overdueDays = dueDate < today 
              ? Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
              : 0
            const fine = overdueDays * 50

            return (
              <tr key={borrow.borrow_id} className="border-b dark:border-gray-700">
                <td className="p-2">{borrow.borrow_id}</td>
                <td className="p-2">{borrow.date_borrow.toDateString()}</td>
                <td className="p-2">{borrow.due_date.toDateString()}</td>
                <td className={`p-2 font-semibold ${fine > 0 ? "text-red-600" : "text-green-600"}`}>
                  ₹{fine}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
