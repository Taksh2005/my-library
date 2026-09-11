import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/app/actions/authActions"

export default async function MyBorrowsPage() {
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
            Please log in to view your borrowed books.
          </p>
        </div>
      </div>
    )
  }

  const borrows = await prisma.bookissuancedetail.findMany({
    where: {
      user_id: user.id,
      returns: {
        none: {},
      },
    },
    include: {
      user: true,
    },
    orderBy: {
      date_borrow: "desc",
    },
  })

  const today = new Date()

  const borrowData = borrows.map((borrow: (typeof borrows)[number]) => {
    const dueDate = new Date(borrow.due_date)

    const overdueDays =
      dueDate < today
        ? Math.floor(
            (today.getTime() - dueDate.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : 0

    const fine = overdueDays * 50

    return {
      ...borrow,
      overdueDays,
      fine,
    }
  })

  const overdueCount = borrowData.filter(
  (borrow: (typeof borrowData)[number]) => borrow.overdueDays > 0
).length

  const totalFine = borrowData.reduce(
  (total: number, borrow: (typeof borrowData)[number]) =>
    total + borrow.fine,
  0
)

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Borrowed Books
              </h1>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                Track your active loans and due dates
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Active Loans
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {borrows.length}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
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
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Overdue
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {overdueCount}
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
                    d="M12 9v3.75m0 3h.007v.008H12v-.008ZM10.29 3.86 2.82 17a1.5 1.5 0 0 0 1.3 2.25h15.76a1.5 1.5 0 0 0 1.3-2.25L13.71 3.86a2 2 0 0 0-3.42 0Z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Current Fine
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  ₹{totalFine}
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
                    d="M12 6v12m4-9.5c0-1.105-1.79-2-4-2s-4 .895-4 2 1.79 2 4 2 4 .895 4 2-1.79 2-4 2-4-.895-4-2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {borrowData.length === 0 ? (
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332-.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>

            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              No borrowed books
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              You currently have no active book loans.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Active Loans
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Books currently issued to your account
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left dark:border-gray-800 dark:bg-gray-950/50">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Borrow ID
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Borrowed On
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Due Date
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Fine
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {borrowData.map((borrow: (typeof borrowData)[number]) => {
                    const dueDate = new Date(borrow.due_date)
                    const isOverdue = borrow.overdueDays > 0

                    return (
                      <tr
                        key={borrow.borrow_id}
                        className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="px-6 py-5">
                          <span className="font-medium text-gray-900 dark:text-white">
                            #{borrow.borrow_id}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {borrow.date_borrow.toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`text-sm font-medium ${
                              isOverdue
                                ? "text-red-600 dark:text-red-400"
                                : "text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {dueDate.toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          {isOverdue ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                              {borrow.overdueDays}{" "}
                              {borrow.overdueDays === 1
                                ? "day overdue"
                                : "days overdue"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              On time
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-5 text-right">
                          <span
                            className={`font-semibold ${
                              borrow.fine > 0
                                ? "text-red-600 dark:text-red-400"
                                : "text-green-600 dark:text-green-400"
                            }`}
                          >
                            ₹{borrow.fine}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-950/40">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Fine is calculated at ₹50 per overdue day.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}