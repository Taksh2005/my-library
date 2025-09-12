import Link from "next/link"

export default function Sidebar({ role }: { role: string }) {
  return (
    <aside className="w-64 bg-blue-800 h-screen sticky top-0 p-4 border-r">
      <h2 className="text-lg  text-white font-bold mb-4">Dashboard</h2>
      <ul className="space-y-2">
        {role === "ADMIN" ? (
          <>
            <li><Link href="/admin/books" className="block p-2 hover:bg-blue-600 rounded text-white">📖 Manage Books</Link></li>
            <li><Link href="/admin/requests" className="block p-2 hover:bg-blue-600 rounded text-white">📩 Issue Requests</Link></li>
            <li><Link href="/admin/categories" className="block p-2 hover:bg-blue-600 rounded text-white">📂 Categories</Link></li>
            <li><Link href="/admin/members" className="block p-2 hover:bg-blue-600 rounded text-white">👥 Members</Link></li>
          </>
        ) : (
          <>
            <li><Link href="/user/requests" className="block p-2 hover:bg-blue-600 rounded text-white">📩 My Requests</Link></li>
            <li><Link href="/user/bookmarks" className="block p-2 hover:bg-blue-600 rounded text-white">⭐ My Bookmarks</Link></li>
            <li><Link href="/user/profile" className="block p-2 hover:bg-blue-600 rounded text-white">👤 Profile</Link></li>
          </>
        )}
      </ul>
    </aside>
  )
}
