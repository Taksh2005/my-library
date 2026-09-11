import { getCurrentUser } from "@/app/actions/authActions"
import Link from "next/link"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40">
            <svg
              className="h-8 w-8 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome to the Library
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Please sign in to access your dashboard and manage your books.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Sign in
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </main>
    )
  }

  const isAdmin = user.role === "ADMIN"

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {isAdmin ? "Admin Dashboard" : "Library Dashboard"}
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Welcome back, {user.firstname}
          </h1>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            What would you like to do today?
          </p>
        </div>

        {/* User Features */}
        <section>
          <div className="mb-4 flex items-center gap-3">
            <div className="h-6 w-1 rounded-full bg-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              My Library
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            <DashboardCard
              icon="book"
              title="Library"
              description="Browse and discover books available in the library."
              href="/"
            />

            <DashboardCard
              icon="bookmark"
              title="Bookmarks"
              description="View the books you've saved for later."
              href="/dashboard/bookmarks"
            />

            <DashboardCard
              icon="request"
              title="My Requests"
              description="Track your book issue requests and their status."
              href="/dashboard/my-requests"
            />

            <DashboardCard
              icon="borrow"
              title="My Borrows"
              description="View books you've currently issued and their return dates."
              href="/dashboard/my-borrows"
            />

            <DashboardCard
              icon="user"
              title="Edit Profile"
              description="Update your name, email, and other account details."
              href="/dashboard/edit-profile"
            />

          </div>
        </section>

        {/* Admin Features */}
        {isAdmin && (
          <section className="mt-10">

            <div className="mb-4 flex items-center gap-3">
              <div className="h-6 w-1 rounded-full bg-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Administration
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              <DashboardCard
                icon="manage-request"
                title="Manage Requests"
                description="Review, approve, or reject book requests from users."
                href="/dashboard/manage-requests"
                admin
              />

              <DashboardCard
                icon="borrowed"
                title="Borrowed Books"
                description="Monitor currently borrowed books and manage returns."
                href="/dashboard/borrowed-books"
                admin
              />

              <DashboardCard
                icon="users"
                title="Manage Users"
                description="View, add, edit, or remove library users."
                href="/dashboard/manage-users"
                admin
              />

              <DashboardCard
                icon="resources"
                title="Manage Resources"
                description="Add, edit, or remove books and other library resources."
                href="/dashboard/manage-resources"
                admin
              />

            </div>
          </section>
        )}

      </div>
    </main>
  )
}

function DashboardCard({
  title,
  description,
  href,
  icon,
  admin = false,
}: {
  title: string
  description: string
  href: string
  icon: string
  admin?: boolean
}) {
  return (
    <Link href={href} className="group block">
      <div
        className={`
          h-full rounded-2xl border bg-white p-5 shadow-sm
          transition-all duration-200
          group-hover:-translate-y-1 group-hover:shadow-md
          dark:bg-gray-900
          ${
            admin
              ? "border-purple-100 hover:border-purple-300 dark:border-purple-900/40 dark:hover:border-purple-700"
              : "border-gray-200 hover:border-blue-300 dark:border-gray-800 dark:hover:border-blue-800"
          }
        `}
      >
        <div className="flex items-start justify-between">

          {/* Icon */}
          <div
            className={`
              flex h-11 w-11 items-center justify-center rounded-xl
              ${
                admin
                  ? "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400"
                  : "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
              }
            `}
          >
            <DashboardIcon name={icon} />
          </div>

          {/* Arrow */}
          <svg
            className="h-5 w-5 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-gray-500 dark:text-gray-700 dark:group-hover:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>

        <h3 className="mt-5 text-base font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>

        <p className="mt-1.5 text-sm leading-6 text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
    </Link>
  )
}

function DashboardIcon({ name }: { name: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
  }

  switch (name) {
    case "book":
      return (
        <svg {...common} className="h-6 w-6">
          <path
            strokeWidth={1.7}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"
          />
        </svg>
      )

    case "bookmark":
      return (
        <svg {...common} className="h-6 w-6">
          <path
            strokeWidth={1.7}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z"
          />
        </svg>
      )

    case "request":
    case "manage-request":
      return (
        <svg {...common} className="h-6 w-6">
          <path
            strokeWidth={1.7}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h6l5 5v11a2 2 0 01-2 2z"
          />
          <path strokeWidth={1.7} d="M13 3v5h5" />
        </svg>
      )

    case "borrow":
    case "borrowed":
      return (
        <svg {...common} className="h-6 w-6">
          <path
            strokeWidth={1.7}
            d="M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
          />
        </svg>
      )

    case "user":
      return (
        <svg {...common} className="h-6 w-6">
          <path
            strokeWidth={1.7}
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"
          />
        </svg>
      )

    case "users":
      return (
        <svg {...common} className="h-6 w-6">
          <path
            strokeWidth={1.7}
            d="M15 19a6 6 0 00-12 0m9-10a3 3 0 11-6 0 3 3 0 016 0zm4-3a3 3 0 010 6m3 7a5 5 0 00-4-4.9"
          />
        </svg>
      )

    case "resources":
      return (
        <svg {...common} className="h-6 w-6">
          <path
            strokeWidth={1.7}
            d="M4 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"
          />
          <path strokeWidth={1.7} d="M8 7h8M8 11h8M8 15h5" />
        </svg>
      )

    default:
      return (
        <svg {...common} className="h-6 w-6">
          <circle cx="12" cy="12" r="8" strokeWidth={1.7} />
        </svg>
      )
  }
}
