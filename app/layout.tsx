import Navbar from "@/app/components/Navbar"
import "./global.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // later: get user from session/cookies

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar/>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
