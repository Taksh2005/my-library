"use client"

import { useState, useEffect } from "react"
import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  getCategories,
} from "@/app/actions/resourceActions"

type Category = {
  category_id: number
  classname: string
}

type Book = {
  book_id: number
  book_title: string
  author: string
  publisher_name: string
  ISBN: string
  copyright_year: number
  category_id: number
  book_copies: number
  status: string
  book_pub: string
  date_receiver: string | Date
  category?: Category | null
}

type BookFormData = {
  book_title: string
  author: string
  publisher_name: string
  ISBN: string
  copyright_year: number
  category_id: number | null
  status: string
  book_copies: number
  book_pub: string
  date_receiver: string
}

export default function ManageResourcesPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)

      const [b, c] = await Promise.all([
        getBooks(),
        getCategories(),
      ])

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

  function openAddForm() {
    setEditingBook(null)
    setShowForm(true)
  }

  function openEditForm(book: Book) {
    setEditingBook(book)
    setShowForm(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
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
                    d="M4 19.5V6.75A2.75 2.75 0 0 1 6.75 4H20v15.5H6.75A2.75 2.75 0 0 0 4 22m0-2.5A2.5 2.5 0 0 1 6.5 17.5H20"
                  />
                </svg>
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Manage Resources
                </h1>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                  Add, edit, and manage books in the library catalog
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openAddForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow"
            >
              <svg
                className="h-4.5 w-4.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 5v14m-7-7h14"
                />
              </svg>
              Add Book
            </button>
          </div>

          <div className="mt-5 h-px bg-gray-200 dark:bg-gray-800" />
        </div>

        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Books
            </p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {books.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Available
            </p>
            <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
              {books.filter((book) => book.status === "Available").length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Categories
            </p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {categories.length}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {loading ? (
            <div className="flex flex-col items-center justify-center px-6 py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400" />
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Loading books...
              </p>
            </div>
          ) : books.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 19.5V6.75A2.75 2.75 0 0 1 6.75 4H20v15.5H6.75A1.75 1.75 0 0 0 5 21.25"
                  />
                </svg>
              </div>

              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                No books in the catalog
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Add your first book to start building the library catalog.
              </p>

              <button
                type="button"
                onClick={openAddForm}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 5v14m-7-7h14"
                  />
                </svg>
                Add Book
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950/60">
                  <tr>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Book
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Author
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Category
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      ISBN
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Copies
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {books.map((book) => (
                    <tr
                      key={book.book_id}
                      className="transition hover:bg-gray-50/80 dark:hover:bg-gray-800/40"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-9 shrink-0 items-center justify-center rounded-md bg-blue-600 text-white shadow-sm">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeWidth={1.7}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 4.75A1.75 1.75 0 0 1 6.75 3H20v17H6.75A1.75 1.75 0 0 0 5 21.75m0-17v17m0-17h11.5"
                              />
                            </svg>
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-xs truncate text-sm font-semibold text-gray-900 dark:text-white">
                              {book.book_title}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                              ID: {book.book_id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {book.author}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                          {book.category?.classname || "Uncategorized"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                          {book.ISBN}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {book.book_copies}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                            book.status === "Available"
                              ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                              : book.status === "Borrowed"
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                                : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                          }`}
                        >
                          <span
                            className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                              book.status === "Available"
                                ? "bg-green-500"
                                : book.status === "Borrowed"
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }`}
                          />
                          {book.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(book)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-900/60 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
                          >
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeWidth={1.8}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m16.5 4.5 3 3M5 19l3.5-.75L19 7.75a2.12 2.12 0 0 0-3-3L5.5 15.25 5 19Z"
                              />
                            </svg>
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(book.book_id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-50 dark:border-gray-700 dark:bg-gray-900 dark:text-red-400 dark:hover:border-red-900/60 dark:hover:bg-red-950/30"
                          >
                            <svg
                              className="h-3.5 w-3.5"
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
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <BookForm
          onClose={() => setShowForm(false)}
          onSave={(newBook) => {
            if (editingBook) {
              setBooks(
                books.map((b) =>
                  b.book_id === newBook.book_id ? newBook : b
                )
              )
            } else {
              setBooks([...books, newBook])
            }

            setShowForm(false)
          }}
          editingBook={editingBook}
          categories={categories}
        />
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
  onSave: (book: Book) => void
  editingBook: Book | null
  categories: Category[]
}) {
  const [form, setForm] = useState<BookFormData>(
    editingBook
      ? {
          book_title: editingBook.book_title,
          author: editingBook.author,
          publisher_name: editingBook.publisher_name,
          ISBN: editingBook.ISBN,
          copyright_year: editingBook.copyright_year,
          category_id: editingBook.category_id,
          status: editingBook.status,
          book_copies: editingBook.book_copies,
          book_pub: editingBook.book_pub,
          date_receiver:
            editingBook.date_receiver instanceof Date
              ? editingBook.date_receiver.toISOString()
              : editingBook.date_receiver,
        }
      : {
          book_title: "",
          author: "",
          publisher_name: "",
          ISBN: "",
          copyright_year: new Date().getFullYear(),
          category_id: categories[0]?.category_id ?? null,
          status: "Available",
          book_copies: 1,
          book_pub: "",
          date_receiver: new Date().toISOString(),
        }
  )

  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      let saved: Book

      const bookData = {
        ...form,
        book_copies: Number(form.book_copies),
        copyright_year: Number(form.copyright_year),
        category_id: Number(form.category_id),
      }

      if (editingBook) {
        saved = await updateBook(editingBook.book_id, bookData)
      } else {
        saved = await addBook(bookData)
      }

      onSave(saved)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 dark:border-gray-800 dark:bg-gray-900 sm:px-6">
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
                  d="M4 19.5V6.75A2.75 2.75 0 0 1 6.75 4H20v15.5H6.75A1.75 1.75 0 0 0 5 21.25"
                />
              </svg>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingBook ? "Edit Book" : "Add Book"}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {editingBook
                  ? "Update the book's catalog information"
                  : "Add a new book to the library catalog"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
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
                d="m6 6 12 12M18 6 6 18"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-5 py-6 sm:px-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Book title
                </label>
                <input
                  type="text"
                  value={form.book_title}
                  onChange={(e) =>
                    setForm({ ...form, book_title: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-blue-400"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Author
                </label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) =>
                    setForm({ ...form, author: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-blue-400"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Publisher
                </label>
                <input
                  type="text"
                  value={form.publisher_name}
                  onChange={(e) =>
                    setForm({ ...form, publisher_name: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-blue-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  ISBN
                </label>
                <input
                  type="text"
                  value={form.ISBN}
                  onChange={(e) =>
                    setForm({ ...form, ISBN: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-blue-400"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Publication year
                </label>
                <input
                  type="number"
                  value={form.copyright_year}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      copyright_year: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-blue-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Number of copies
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.book_copies}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      book_copies: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-blue-400"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <select
                  value={form.category_id ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category_id: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-blue-400"
                >
                  {categories.map((c) => (
                    <option key={c.category_id} value={c.category_id}>
                      {c.classname}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-blue-400"
                >
                  <option value="Available">Available</option>
                  <option value="Borrowed">Borrowed</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-gray-200 px-5 py-4 dark:border-gray-800 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingBook
                  ? "Save Changes"
                  : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}