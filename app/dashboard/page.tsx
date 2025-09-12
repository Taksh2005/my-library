import { getCurrentUser } from "@/app/actions/authActions"
import Link from "next/link"

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg">
          Please{" "}
          <Link href="/login" className="text-blue-600 underline">
            log in
          </Link>{" "}
          to view your dashboard.
        </p>
      </div>
    )
  }

  const isAdmin = user.role === "ADMIN"

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Greeting */}
      <h1 className="text-3xl font-bold mb-8">
        Welcome back, {user.firstname} 👋
      </h1>

      {/* Dashboard Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* ===== User Features ===== */}
        <DashboardCard
          title="📚 Library"
          description="View all the books available in Library"
          href="/"
        />
        <DashboardCard
          title="📚 Bookmarks"
          description="View all the books you saved for later."
          href="/dashboard/bookmarks"
        />
        <DashboardCard
          title="📖 My Requests"
          description="Track your book issue requests and their status."
          href="/dashboard/my-requests"
        />
        <DashboardCard
          title="📖 My Borrows"
          description="See the books you have issued and must return timely"
          href="/dashboard/my-borrows"
        />
        <DashboardCard
          title="✏️ Edit Profile"
          description="Update your account details like name and email."
          href="/dashboard/edit-profile"
        />

        {/* ===== Admin Features ===== */}
        {isAdmin && (
          <>
            <DashboardCard
              title="📝 Manage Requests"
              description="Approve or reject book requests from users."
              href="/dashboard/manage-requests"
            />
            <DashboardCard
              title="📝 Borrowed Books"
              description="Approve or reject book requests from users."
              href="/dashboard/borrowed-books"
            />
            <DashboardCard
              title="👥 Manage Users"
              description="Add, edit, or remove users from the system."
              href="/dashboard/manage-users"
            />
            <DashboardCard
              title="📦 Manage Resources"
              description="Add, edit, or delete books and other resources."
              href="/dashboard/manage-resources"
            />
          </>
        )}
      </div>
    </div>
  )
}

function DashboardCard({
  title,
  description,
  href,
  danger,
}: {
  title: string
  description: string
  href: string
  danger?: boolean
}) {
  return (
    <Link href={href}>
      <div
        className={`p-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer 
        ${danger ? "bg-red-50 hover:bg-red-100 text-red-700" : "bg-white dark:bg-gray-800"}
        `}
      >
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </Link>
  )
}
