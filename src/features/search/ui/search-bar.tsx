"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Search, X } from "lucide-react"

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  initialValue?: string
}

export const SearchBar = ({ onSearch, placeholder = "Search movies...", initialValue = "" }: SearchBarProps) => {
  const [query, setQuery] = useState(initialValue)

  useEffect(() => {
    setQuery(initialValue)
  }, [initialValue])

  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      const debounceTimer = setTimeout(() => {
        onSearch(searchQuery)
      }, 500)

      return () => clearTimeout(debounceTimer)
    },
    [onSearch],
  )

  useEffect(() => {
    if (query !== initialValue || initialValue === "") {
      const cleanup = debouncedSearch(query)
      return cleanup
    }
  }, [query, debouncedSearch, initialValue])

  const clearSearch = useCallback(() => {
    setQuery("")
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }, [])

  const showClearButton = useMemo(() => Boolean(query), [query])

  return (
    <div className="relative max-w-md mx-auto mb-8">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      />
      {showClearButton && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          title="Clear search"
          aria-label="Clear search"
        >
          <X className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </button>
      )}
    </div>
  )
}
