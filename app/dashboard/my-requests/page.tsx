import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/app/actions/authActions"

export default async function MyRequestsPage() {
  const user = await getCurrentUser()
  if (!user) {
    return <div className="p-6">You must be logged in to view requests.</div>
  }

  const requests = await prisma.bookRequest.findMany({
    where: { user_id: user.id },
    include: { book: true },
    orderBy: { createdAt: "desc" },
  })

  if (requests.length === 0) {
    return <div className="p-6">You have no requests.</div>
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Requests</h1>
      <table className="w-full border border-gray-300 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="p-2 text-left">Book</th>
            <th className="p-2">Status</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.request_id} className="border-t border-gray-200 dark:border-gray-700">
              <td className="p-2">{req.book.book_title}</td>
              <td
                className={`p-2 font-semibold ${
                  req.status === "APPROVED"
                    ? "text-green-600"
                    : req.status === "REJECTED"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {req.status}
              </td>
              <td className="p-2">{new Date(req.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
