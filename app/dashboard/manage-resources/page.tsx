"use client"

import { useState, useEffect } from "react"
import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  getCategories,
  addCategory,
} from "@/app/actions/resourceActions"

export default function ManageResourcesPage() {
  const [books, setBooks] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBook, setEditingBook] = useState<any | null>(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const [b, c] = await Promise.all([getBooks(), getCategories()])
      setBooks(b)
      setCategories(c)
      setLoading(false)
    }
    loadData()
  }, [])

  async function handleDelete(id: number) {
    await deleteBook(id)
    setBooks(books.filter((b) => b.book_id !== id))
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📚 Manage Resources</h1>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => {
            setEditingBook(null)
            setShowForm(true)
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ➕ Add Book
        </button>
      </div>

      {showForm && (
        <BookForm
          onClose={() => setShowForm(false)}
          onSave={(newBook) => {
            if (editingBook) {
              setBooks(books.map((b) => (b.book_id === newBook.book_id ? newBook : b)))
            } else {
              setBooks([...books, newBook])
            }
            setShowForm(false)
          }}
          editingBook={editingBook}
          categories={categories}
        />
      )}

      {loading ? (
        <p>Loading books...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full border-collapse bg-white dark:bg-gray-800">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                <th className="p-3">ID</th>
                <th className="p-3">Title</th>
                <th className="p-3">Author</th>
                <th className="p-3">Category</th>
                <th className="p-3">ISBN</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.book_id} className="border-b dark:border-gray-700">
                  <td className="p-3">{book.book_id}</td>
                  <td className="p-3">{book.book_title}</td>
                  <td className="p-3">{book.author}</td>
                  <td className="p-3">{book.category?.classname}</td>
                  <td className="p-3">{book.ISBN}</td>
                  <td className="p-3">{book.status}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => {
                        setEditingBook(book)
                        setShowForm(true)
                      }}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book.book_id)}
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

function BookForm({
  onClose,
  onSave,
  editingBook,
  categories,
}: {
  onClose: () => void
  onSave: (book: any) => void
  editingBook: any | null
  categories: any[]
}) {
  const [form, setForm] = useState(
    editingBook || {
      book_title: "",
      author: "",
      publisher_name: "",
      ISBN: "",
      copyright_year: new Date().getFullYear(),
      category_id: categories[0]?.category_id || null,
      status: "Available",
      book_copies: 1, // 👈 added default copies
      book_pub: "",
      date_receiver: new Date().toISOString(),
    }
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    let saved
    if (editingBook) {
  saved = await updateBook(editingBook.book_id, {
    ...form,
    book_copies: Number(form.book_copies),
  })
} else {
  saved = await addBook({
    ...form,
    book_copies: Number(form.book_copies),
  })
}

    onSave(saved)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          {editingBook ? "Edit Book" : "Add Book"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Title"
            value={form.book_title}
            onChange={(e) => setForm({ ...form, book_title: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Author"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Publisher"
            value={form.publisher_name}
            onChange={(e) => setForm({ ...form, publisher_name: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="ISBN"
            value={form.ISBN}
            onChange={(e) => setForm({ ...form, ISBN: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Year"
            value={form.copyright_year}
            onChange={(e) =>
              setForm({ ...form, copyright_year: parseInt(e.target.value) })
            }
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Number of Copies"
            value={form.book_copies}
            onChange={(e) =>
              setForm({ ...form, book_copies: parseInt(e.target.value) })
            }
            className="w-full p-2 border rounded"
            required
          />
          <select
            value={form.category_id}
            onChange={(e) =>
              setForm({ ...form, category_id: parseInt(e.target.value) })
            }
            className="w-full p-2 border rounded"
          >
            {categories.map((c) => (
              <option key={c.category_id} value={c.category_id}>
                {c.classname}
              </option>
            ))}
          </select>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="Available">Available</option>
            <option value="Borrowed">Borrowed</option>
            <option value="Lost">Lost</option>
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

