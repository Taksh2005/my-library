"use client"
import { useState } from "react"
import { registerUser } from "@/app/actions/authActions"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    password: ""
  })
  const [error, setError] = useState("")

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    const res = await registerUser(form)
    if (res.success) {
      router.push("/dashboard")
    } else {
      setError("Registration failed. Try again.")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded shadow">
      <h1 className="text-xl font-bold mb-4">Register</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleRegister} className="space-y-3">
        <input
          name="username"
          className="border p-2 w-full"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          className="border p-2 w-full"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="firstname"
          className="border p-2 w-full"
          placeholder="First Name"
          value={form.firstname}
          onChange={handleChange}
          required
        />
        <input
          name="lastname"
          className="border p-2 w-full"
          placeholder="Last Name"
          value={form.lastname}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          className="border p-2 w-full"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Register
        </button>
      </form>
    </div>
  )
}
