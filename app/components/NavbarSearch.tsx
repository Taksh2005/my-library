"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { searchBooks } from "@/app/actions/bookActions";

type BookSuggestion = {
  book_id: number;
  book_title: string;
  author: string;
  publisher_name: string;
  ISBN: string;
  copyright_year: number;
};

export default function NavbarSearch() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<BookSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const trimmedQuery = query.trim();

    // Don't search when empty
    if (!trimmedQuery) {
      setBooks([]);
      setShowResults(false);
      setLoading(false);
      return;
    }

    // Wait 300ms after the user stops typing
    const timeout = setTimeout(async () => {
      setLoading(true);

      try {
        const results = await searchBooks(trimmedQuery);

        setBooks(results);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
        setBooks([]);
        setShowResults(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function showAllResults() {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) return;

    setShowResults(false);

    router.push(`/?search=${encodeURIComponent(trimmedQuery)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      showAllResults();
    }

    if (e.key === "Escape") {
      setShowResults(false);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      {/* Search input */}
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
          />
        </svg>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim()) {
              setShowResults(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search books..."
          className="w-full rounded-xl border border-white/20 bg-black/25 py-2.5 pl-11 pr-10 text-sm text-white outline-none transition placeholder:text-white/60 focus:border-white/40 focus:bg-black/35 focus:ring-2 focus:ring-white/10"
        />

        {loading && (
          <svg
            className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-white/70"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-30"
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-90"
              fill="currentColor"
              d="M21 12a9 9 0 0 1-9 9v-3a6 6 0 0 0 6-6h3Z"
            />
          </svg>
        )}
      </div>

      {/* Search results */}
      {showResults && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-[60] mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
          {loading ? (
            <div className="px-4 py-5 text-center text-sm text-gray-500 dark:text-gray-400">
              Searching...
            </div>
          ) : books.length > 0 ? (
            <>
              <div className="max-h-80 overflow-y-auto">
                {books.map((book) => (
                  <Link
                    key={book.book_id}
                    href={`/book/${book.book_id}`}
                    onClick={() => setShowResults(false)}
                    className="flex items-center gap-3 px-4 py-3 transition hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {/* Small book icon */}
                    <div className="flex h-10 w-8 shrink-0 items-center justify-center rounded bg-blue-600">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeWidth={1.6}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253"
                        />
                      </svg>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {book.book_title}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                        {book.author}
                        {" • "}
                        {book.copyright_year}
                      </p>
                    </div>

                    <svg
                      className="h-4 w-4 shrink-0 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m9 5 7 7-7 7"
                      />
                    </svg>
                  </Link>
                ))}
              </div>

              {/* Show all */}
              <button
                type="button"
                onClick={showAllResults}
                className="flex w-full items-center justify-center gap-2 border-t border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800/70 dark:text-blue-400 dark:hover:bg-gray-800"
              >
                Show all results for "{query.trim()}"
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
                    d="m9 5 7 7-7 7"
                  />
                </svg>
              </button>
            </>
          ) : (
            <div className="px-5 py-6 text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                No books found
              </p>

              <button
                type="button"
                onClick={showAllResults}
                className="mt-2 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Search all results
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
