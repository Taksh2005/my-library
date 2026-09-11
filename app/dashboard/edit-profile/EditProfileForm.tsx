"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Profile = {
  firstname: string
  lastname: string
  email: string | null
  username: string
}

export default function EditProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter()

  const [formData, setFormData] = useState<Profile>(profile)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [pwdLoading, setPwdLoading] = useState(false)
  const [pwdMessage, setPwdMessage] = useState("")

  const [showDelete, setShowDelete] = useState(false)
  const [deletePassword, setDeletePassword] = useState("")
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteMessage, setDeleteMessage] = useState("")

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const res = await fetch("/api/user/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const json = await res.json()

      if (res.ok) {
        setMessage("Profile updated successfully")
        router.refresh()
      } else {
        setMessage(json.error || "Failed to update profile")
      }
    } catch {
      setMessage("Unable to connect to the server")
    }

    setLoading(false)
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwdMessage("Please fill in all fields")
      return
    }

    if (newPassword !== confirmPassword) {
      setPwdMessage("New password and confirmation do not match")
      return
    }

    setPwdLoading(true)
    setPwdMessage("")

    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const json = await res.json()

      if (res.ok) {
        setPwdMessage("Password updated successfully")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setPwdMessage(json.error || "Failed to change password")
      }
    } catch {
      setPwdMessage("Unable to connect to the server")
    }

    setPwdLoading(false)
  }

  async function handleDeleteAccount(e: React.FormEvent) {
    e.preventDefault()

    if (!deletePassword) {
      setDeleteMessage("Please enter your password")
      return
    }

    setDeleteLoading(true)
    setDeleteMessage("")

    try {
      const res = await fetch("/api/user/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      })

      const json = await res.json()

      if (res.ok) {
        router.push("/")
        router.refresh()
      } else {
        setDeleteMessage(json.error || "Failed to delete account")
      }
    } catch {
      setDeleteMessage("Unable to connect to the server")
    }

    setDeleteLoading(false)
  }

  return (
    <div className="space-y-5">
      <form
        onSubmit={handleProfileSubmit}
        className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="border-b border-gray-200 px-5 py-5 dark:border-gray-800 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 7.25a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 19.25c.45-3.1 2.85-5 7.5-5s7.05 1.9 7.5 5"
                />
              </svg>
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Personal Information
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Update the information associated with your account
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-5 py-6 sm:px-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                First name
              </label>
              <input
                type="text"
                value={formData.firstname}
                onChange={(e) =>
                  setFormData({ ...formData, firstname: e.target.value })
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-blue-400"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Last name
              </label>
              <input
                type="text"
                value={formData.lastname}
                onChange={(e) =>
                  setFormData({ ...formData, lastname: e.target.value })
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-blue-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email address
            </label>
            <input
              type="email"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-blue-400"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-blue-400"
              required
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-h-5">
              {message && (
                <p
                  className={`text-sm ${
                    message.includes("successfully")
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>

      <form
        onSubmit={handleChangePassword}
        className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="border-b border-gray-200 px-5 py-5 dark:border-gray-800 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V8a4.5 4.5 0 0 0-9 0v2.5m-1 0h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Zm5.5 4v1.5"
                />
              </svg>
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Change Password
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Keep your account secure with a strong password
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-5 py-6 sm:px-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Current password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-blue-400"
              required
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                New password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-blue-400"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm new password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-blue-400"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-h-5">
              {pwdMessage && (
                <p
                  className={`text-sm ${
                    pwdMessage.includes("successfully")
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {pwdMessage}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={pwdLoading}
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-750"
            >
              {pwdLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      </form>

      <section className="overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm dark:border-red-950/60 dark:bg-gray-900">
        <div className="border-b border-red-100 bg-red-50/60 px-5 py-5 dark:border-red-950/50 dark:bg-red-950/20 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 7h12m-9 0V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7m-7 0 .75 12.5a1.5 1.5 0 0 0 1.5 1.5h3.5a1.5 1.5 0 0 0 1.5-1.5L16 7M10 10.5v6m4-6v6"
                />
              </svg>
            </div>

            <div>
              <h2 className="text-base font-semibold text-red-700 dark:text-red-400">
                Danger Zone
              </h2>
              <p className="text-sm text-red-600/80 dark:text-red-400/70">
                Permanently remove your account and associated data
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 py-5 sm:px-6">
          {!showDelete ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-sm leading-6 text-gray-500 dark:text-gray-400">
                Deleting your account is permanent and cannot be undone.
              </p>

              <button
                type="button"
                onClick={() => setShowDelete(true)}
                className="inline-flex shrink-0 items-center justify-center rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/60 dark:bg-gray-900 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                Delete Account
              </button>
            </div>
          ) : (
            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Confirm account deletion
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Enter your password to permanently delete your account.
                </p>
              </div>

              <input
                type="password"
                placeholder="Your password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full rounded-xl border border-red-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-900/60 dark:bg-gray-950 dark:text-white"
                required
              />

              {deleteMessage && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {deleteMessage}
                </p>
              )}

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowDelete(false)
                    setDeletePassword("")
                    setDeleteMessage("")
                  }}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={deleteLoading}
                  className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleteLoading ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}