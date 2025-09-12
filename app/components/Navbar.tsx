import Link from "next/link"
import { getCurrentUser, logoutUser } from "@/app/actions/authActions"

export default async function Navbar() {
  const user = await getCurrentUser()

  return (
    <nav className="flex items-center justify-between bg-blue-600 text-white px-6 py-3 sticky top-0 z-50">
      <Link href="/" className="text-xl font-bold">📚 MyLibrary</Link>

      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link href="/login" className="hover:underline">Login</Link>
            <Link href="/register" className="hover:underline">Register</Link>
          </>
        ) : (
          <form action={logoutUser}>
            <div className="flex items-center gap-3">
              <span>👋 {user.firstname}</span>
              <Link href="/dashboard" className="hover:underline">Dashboard</Link>
              <button type="submit" className="hover:underline">Logout</button>
            </div>
          </form>
        )}
      </div>
    </nav>
  )
}
