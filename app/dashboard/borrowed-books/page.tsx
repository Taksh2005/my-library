import { getActiveBorrows, markBookReturned } from "@/app/actions/adminActions";

export default async function BorrowedBooksPage() {
  const borrows = await getActiveBorrows();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Zm0 0V19m4-12h8m-8 4h6"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Borrowed Books
            </h1>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              Manage currently borrowed books and return records
            </p>
          </div>
        </div>

        {borrows.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400">
              <svg
                className="h-8 w-8"
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
            </div>

            <h2 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">
              No active borrows
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              All borrowed books have been returned.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Active Borrows
                </h2>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {borrows.length}{" "}
                  {borrows.length === 1 ? "active borrow" : "active borrows"}
                </p>
              </div>

              <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-blue-50 px-2.5 text-sm font-semibold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                {borrows.length}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:bg-gray-950/50 dark:text-gray-400">
                    <th className="px-5 py-3.5 font-semibold">Book</th>
                    <th className="px-5 py-3.5 font-semibold">Borrower</th>
                    <th className="px-5 py-3.5 font-semibold">Borrowed</th>
                    <th className="px-5 py-3.5 font-semibold">Due Date</th>
                    <th className="px-5 py-3.5 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {borrows.map((b) => (
                    <tr
                      key={b.borrow_id}
                      className="transition hover:bg-gray-50/80 dark:hover:bg-gray-800/30"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-8 shrink-0 items-center justify-center rounded bg-blue-600 text-white">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeWidth={1.7}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 4.75A1.75 1.75 0 0 1 7.75 3H19v17H7.75A1.75 1.75 0 0 1 6 18.25V4.75ZM6 18.25A1.75 1.75 0 0 1 7.75 16H19"
                              />
                            </svg>
                          </div>

                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {b.book?.book_title ?? "Unknown book"}
                            </p>

                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Borrow ID: {b.borrow_id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold uppercase text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            {b.user.firstname?.charAt(0)}
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {b.user.firstname} {b.user.lastname}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              User ID: {b.user_id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {new Date(b.date_borrow).toLocaleDateString()}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                          {new Date(b.due_date).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <form
                          action={async () => {
                            "use server";
                            await markBookReturned(b.borrow_id, b.book.book_id);
                          }}
                        >
                          <button
                            type="submit"
                            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/30"
                          >
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
                            Mark Returned
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
