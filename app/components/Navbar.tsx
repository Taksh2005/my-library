import Link from "next/link"
import { getCurrentUser, logoutUser } from "@/app/actions/authActions"
import NavbarSearch from "@/app/components/NavbarSearch"

export default async function Navbar() {
  const user = await getCurrentUser()

  return (
    <nav className="sticky top-0 z-50 border-b border-blue-700/30 bg-blue-600 text-white shadow-sm">
      <div className="mx-auto flex min-h-[68px] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/10 transition group-hover:bg-white/20">
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
                d="M12 6.25C10.83 5.47 9.25 5 7.5 5S4.17 5.47 3 6.25v13C4.17 18.47 5.75 18 7.5 18s3.33.47 4.5 1.25m0-13C13.17 5.47 14.75 5 16.5 5s3.33.47 4.5 1.25v13C19.83 18.47 18.25 18 16.5 18s-3.33-.47-4.5 1.25"
              />
            </svg>
          </span>

          <div className="hidden sm:block">
            <div className="text-[17px] font-bold leading-none tracking-tight">
              MyLibrary
            </div>
            <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-blue-100/80">
              Digital Library
            </div>
          </div>
        </Link>

        {/* Search */}
        <div className="min-w-0 flex-1">
          <NavbarSearch />
        </div>

        {/* User Actions */}
        <div className="ml-auto shrink-0">
          {!user ? (
            <div className="flex items-center gap-1.5">
              <Link
                href="/login"
                className="rounded-xl px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50 hover:shadow"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">

              {/* User */}
              <div className="hidden items-center gap-2 rounded-xl bg-white/10 px-3 py-2 sm:flex">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs font-bold uppercase">
                  {user.firstname?.charAt(0)}
                </span>

                <span className="max-w-24 truncate text-sm font-medium">
                  {user.firstname}
                </span>
              </div>

              {/* Dashboard */}
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white"
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
                    d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z"
                  />
                </svg>

                <span className="hidden md:inline">
                  Dashboard
                </span>
              </Link>

              {/* Logout */}
              <form action={logoutUser}>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
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
                      d="M15 12H3m0 0 4-4m-4 4 4 4M14 4h3a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-3"
                    />
                  </svg>

                  <span className="hidden md:inline">
                    Logout
                  </span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}