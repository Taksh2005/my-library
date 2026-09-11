import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/app/actions/authActions"

export default async function MyRequestsPage() {
  const user = await getCurrentUser()

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950">
        <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M15 19.128a9.009 9.009 0 0 0 5.25-1.695M15 19.128v-2.25a4.5 4.5 0 0 0-4.5-4.5H9m6 6.75v-2.25a4.5 4.5 0 0 1 4.5-4.5h.75M9 12.378a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm9.75 1.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
              />
            </svg>
          </div>

          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Login required
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Please log in to view your book requests.
          </p>
        </div>
      </div>
    )
  }

  const requests = await prisma.bookRequest.findMany({
    where: {
      user_id: user.id,
    },
    include: {
      book: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const pendingCount = requests.filter(
    (request) => request.status === "PENDING"
  ).length

  const approvedCount = requests.filter(
    (request) => request.status === "APPROVED"
  ).length

  const rejectedCount = requests.filter(
    (request) => request.status === "REJECTED"
  ).length

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M9 5H7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a3 3 0 0 1 6 0M9 5h6m-6 7h6m-6 4h4"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Requests
            </h1>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              Track the status of your book requests
            </p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pending
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {pendingCount}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M12 6v6l4 2m5-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Approved
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {approvedCount}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="m5 12 4 4L19 6"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Rejected
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {rejectedCount}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="m7 7 10 10M17 7 7 17"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M9 5H7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a3 3 0 0 1 6 0M9 5h6m-6 7h6m-6 4h4"
                />
              </svg>
            </div>

            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              No requests yet
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              You haven't submitted any book requests.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Request History
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your submitted book requests
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left dark:border-gray-800 dark:bg-gray-950/50">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Book
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Requested On
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {requests.map((request) => {
                    const status = request.status

                    const statusStyles =
                      status === "APPROVED"
                        ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                        : status === "REJECTED"
                          ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"

                    const dotStyles =
                      status === "APPROVED"
                        ? "bg-green-500"
                        : status === "REJECTED"
                          ? "bg-red-500"
                          : "bg-amber-500"

                    return (
                      <tr
                        key={request.request_id}
                        className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.8}
                                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                              </svg>
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-medium text-gray-900 dark:text-white">
                                {request.book.book_title}
                              </p>
                              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                Request #{request.request_id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${dotStyles}`}
                            />
                            {status}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-right">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {new Date(
                              request.createdAt
                            ).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}