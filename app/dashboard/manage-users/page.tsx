"use client"

import { useState, useEffect } from "react"
import { getUsers, addUser, updateUser, deleteUser } from "@/app/actions/userActions"

export default function ManageUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<any | null>(null)

  useEffect(() => {
    async function loadUsers() {
      setLoading(true)
      const data = await getUsers()
      setUsers(data)
      setLoading(false)
    }
    loadUsers()
  }, [])

  async function handleDelete(id: number) {
    await deleteUser(id)
    setUsers(users.filter((u) => u.user_id !== id))
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">👥 Manage Users</h1>

      {/* Add New User Button */}
      <button
        onClick={() => {
          setEditingUser(null)
          setShowForm(true)
        }}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ➕ Add User
      </button>

      {/* User Form Modal */}
      {showForm && (
        <UserForm
          onClose={() => setShowForm(false)}
          onSave={(newUser) => {
            if (editingUser) {
              setUsers(users.map((u) => (u.user_id === newUser.user_id ? newUser : u)))
            } else {
              setUsers([...users, newUser])
            }
            setShowForm(false)
          }}
          editingUser={editingUser}
        />
      )}

      {/* Users Table */}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full border-collapse bg-white dark:bg-gray-800">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.user_id} className="border-b dark:border-gray-700">
                  <td className="p-3">{user.user_id}</td>
                  <td className="p-3">
                    {user.firstname} {user.lastname}
                  </td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => {
                        setEditingUser(user)
                        setShowForm(true)
                      }}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.user_id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function UserForm({
  onClose,
  onSave,
  editingUser,
}: {
  onClose: () => void
  onSave: (user: any) => void
  editingUser: any | null
}) {
  const [form, setForm] = useState(
    editingUser || {
      username: "",
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      role: "USER",
    }
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    let saved
    if (editingUser) {
      saved = await updateUser(editingUser.user_id, form)
    } else {
      saved = await addUser(form)
    }
    onSave(saved)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {editingUser ? "Edit User" : "Add User"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="First Name"
            value={form.firstname}
            onChange={(e) => setForm({ ...form, firstname: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={form.lastname}
            onChange={(e) => setForm({ ...form, lastname: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-2 border rounded"
          />
          {!editingUser && (
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          )}
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
