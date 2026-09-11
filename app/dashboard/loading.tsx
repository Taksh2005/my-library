export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
          <div className="mt-3 h-4 w-72 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-28 animate-pulse rounded-2xl bg-white dark:bg-gray-900" />
          <div className="h-28 animate-pulse rounded-2xl bg-white dark:bg-gray-900" />
          <div className="h-28 animate-pulse rounded-2xl bg-white dark:bg-gray-900" />
        </div>
      </div>
    </div>
  )
}