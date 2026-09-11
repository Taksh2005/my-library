export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-800 dark:border-t-blue-500" />

        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      </div>
    </div>
  )
}