import { getAllBookRequests, updateBookRequestStatus } from "@/app/actions/bookRequestActions"
import { revalidatePath } from "next/cache"

async function approveOrReject(id: number, status: "APPROVED" | "REJECTED") {
  "use server"
  await updateBookRequestStatus(id, status)
  revalidatePath("/admin/dashboard/manage-requests")
}

export default async function ManageRequestsPage() {
  const requests = await getAllBookRequests()

  const pendingCount = requests.filter((req) => req.status === "PENDING").length
  const approvedCount = requests.filter((req) => req.status === "APPROVED").length
  const rejectedCount = requests.filter((req) => req.status === "REJECTED").length

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
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
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7h8m-8 4h5m-5 4h8m-10 5h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"
                />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Manage Book Requests
              </h1>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                Review and manage requests from library members
              </p>
            </div>
          </div>

          <div className="mt-5 h-px bg-gray-200 dark:bg-gray-800" />
        </div>

        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Pending
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
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
                    d="M12 6v6l3.5 2"
                  />
                </svg>
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Approved
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400">
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
                    d="m5 12 4 4L19 6"
                  />
                </svg>
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {approvedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Rejected
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
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
                    d="m8 8 8 8m0-8-8 8"
                  />
                </svg>
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {rejectedCount}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {requests.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7h8m-8 4h5m-5 4h8m-10 5h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"
                  />
                </svg>
              </div>

              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                No book requests
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                There are currently no book requests to review.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950/60">
                  <tr>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      ID
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      User
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Book
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Requested
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {requests.map((req) => (
                    <tr
                      key={req.request_id}
                      className="transition hover:bg-gray-50/80 dark:hover:bg-gray-800/40"
                    >
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                          #{req.request_id}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold uppercase text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                            {req.user.username.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                              {req.user.username}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              User
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="max-w-xs px-5 py-4">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {req.book.book_title}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                          Book ID: {req.book.book_id}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                          {new Date(req.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                            req.status === "APPROVED"
                              ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                              : req.status === "REJECTED"
                                ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                                : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                          }`}
                        >
                          <span
                            className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                              req.status === "APPROVED"
                                ? "bg-green-500"
                                : req.status === "REJECTED"
                                  ? "bg-red-500"
                                  : "bg-amber-500"
                            }`}
                          />
                          {req.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {req.status === "PENDING" ? (
                          <div className="flex justify-end gap-2">
                            <form
                              action={approveOrReject.bind(
                                null,
                                req.request_id,
                                "APPROVED"
                              )}
                            >
                              <button
                                type="submit"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                              >
                                <svg
                                  className="h-3.5 w-3.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m5 12 4 4L19 6"
                                  />
                                </svg>
                                Approve
                              </button>
                            </form>

                            <form
                              action={approveOrReject.bind(
                                null,
                                req.request_id,
                                "REJECTED"
                              )}
                            >
                              <button
                                type="submit"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-50 dark:border-gray-700 dark:bg-gray-900 dark:text-red-400 dark:hover:border-red-900/60 dark:hover:bg-red-950/30"
                              >
                                <svg
                                  className="h-3.5 w-3.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m8 8 8 8m0-8-8 8"
                                  />
                                </svg>
                                Reject
                              </button>
                            </form>
                          </div>
                        ) : (
                          <div className="flex justify-end">
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              No action required
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}