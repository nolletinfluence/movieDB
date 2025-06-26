"use client"

import { useMemo, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const getVisiblePages = useCallback(() => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    if (totalPages <= 1) return [1]

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots.filter((item, index, arr) => arr.indexOf(item) === index)
  }, [currentPage, totalPages])

  const visiblePages = useMemo(() => getVisiblePages(), [getVisiblePages])

  const handlePrevPage = useCallback(() => {
    onPageChange(currentPage - 1)
  }, [currentPage, onPageChange])

  const handleNextPage = useCallback(() => {
    onPageChange(currentPage + 1)
  }, [currentPage, onPageChange])

  const handlePageClick = useCallback(
    (page: number | string) => {
      if (typeof page === "number") {
        onPageChange(page)
      }
    },
    [onPageChange],
  )

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {visiblePages.map((page, index) => (
        <button
          key={index}
          onClick={() => handlePageClick(page)}
          disabled={page === "..."}
          className={`px-3 py-2 rounded-lg border transition-colors ${
            page === currentPage
              ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
              : page === "..."
                ? "border-gray-300 dark:border-gray-600 cursor-default bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400"
                : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
          }`}
          aria-label={typeof page === "number" ? `Go to page ${page}` : undefined}
        >
          {page}
        </button>
      ))}

      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
