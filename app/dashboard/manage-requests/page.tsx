import { getAllBookRequests, updateBookRequestStatus } from "@/app/actions/bookRequestActions"
import { revalidatePath } from "next/cache"

async function approveOrReject(id: number, status: "APPROVED" | "REJECTED") {
  "use server"
  await updateBookRequestStatus(id, status)
  revalidatePath("/admin/dashboard/manage-requests")
}

export default async function ManageRequestsPage() {
  const requests = await getAllBookRequests()

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Book Requests</h1>

      <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">User</th>
            <th className="border p-2">Book</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.request_id} className="text-center">
              <td className="border p-2">{req.request_id}</td>
              <td className="border p-2">{req.user.username}</td>
              <td className="border p-2">{req.book.book_title}</td>
              <td className="border p-2">
                {new Date(req.createdAt).toLocaleString()}
              </td>
              <td className="border p-2">{req.status}</td>
              <td className="border p-2">
                {req.status === "PENDING" ? (
                  <div className="flex gap-2 justify-center">
                    <form action={approveOrReject.bind(null, req.request_id, "APPROVED")}>
                      <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                        Approve
                      </button>
                    </form>
                    <form action={approveOrReject.bind(null, req.request_id, "REJECTED")}>
                      <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                        Reject
                      </button>
                    </form>
                  </div>
                ) : (
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      req.status === "APPROVED"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {req.status}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
