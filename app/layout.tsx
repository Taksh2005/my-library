import "./globals.css"
import Navbar from "@/app/components/Navbar"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // later: get user from session/cookies
  const user = null // change after login flow

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar/>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
