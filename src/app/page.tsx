"use client"

import { useState, useCallback, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { moviesApi } from "@/shared/api/movies"
import { HeroBanner } from "@/widgets/hero-banner/ui/hero-banner"
import { MoviesList } from "@/widgets/movies-list/ui/movies-list"
import { SearchBar } from "@/features/search/ui/search-bar"
import { Pagination } from "@/features/pagination/ui/pagination"
import { LoadingSpinner } from "@/shared/ui/loading-spinner"
import { ErrorMessage } from "@/shared/ui/error-message"

export default function HomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [currentPage, setCurrentPage] = useState(() => {
    const urlPage = searchParams.get("page")
    const savedPage = typeof window !== "undefined" ? localStorage.getItem("movies-page") : null
    return urlPage ? Number.parseInt(urlPage) : savedPage ? Number.parseInt(savedPage) : 1
  })

  const [searchQuery, setSearchQuery] = useState(() => {
    const urlQuery = searchParams.get("search")
    const savedQuery = typeof window !== "undefined" ? localStorage.getItem("movies-search") : null
    return urlQuery || savedQuery || ""
  })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["movies", currentPage, searchQuery],
    queryFn: () =>
      searchQuery ? moviesApi.searchMovies(searchQuery, currentPage) : moviesApi.getPopularMovies(currentPage),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  const updateUrlAndStorage = useCallback(
    (page: number, query: string) => {
      const params = new URLSearchParams()

      if (query) {
        params.set("search", query)
      }
      if (page > 1) {
        params.set("page", page.toString())
      }

      const newUrl = params.toString() ? `/?${params.toString()}` : "/"
      router.replace(newUrl, { scroll: false })

      if (typeof window !== "undefined") {
        localStorage.setItem("movies-page", page.toString())
        localStorage.setItem("movies-search", query)
      }
    },
    [router],
  )

  const handleSearch = useCallback(
    (query: string) => {
      const newPage = query === searchQuery ? currentPage : 1
      setSearchQuery(query)
      setCurrentPage(newPage)
      updateUrlAndStorage(newPage, query)
    },
    [currentPage, searchQuery, updateUrlAndStorage],
  )

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page)
      updateUrlAndStorage(page, searchQuery)
      window.scrollTo({ top: 0, behavior: "smooth" })
    },
    [searchQuery, updateUrlAndStorage],
  )

  useEffect(() => {
    const urlPage = searchParams.get("page")
    const urlQuery = searchParams.get("search")

    if (urlPage && Number.parseInt(urlPage) !== currentPage) {
      setCurrentPage(Number.parseInt(urlPage))
    }
    if (urlQuery && urlQuery !== searchQuery) {
      setSearchQuery(urlQuery)
    }
  }, [searchParams, currentPage, searchQuery])

  if (isLoading) return <LoadingSpinner />

  if (error) {
    return <ErrorMessage message="Failed to load movies. Please try again." onRetry={() => refetch()} />
  }

  return (
    <div className="space-y-8">
      {!searchQuery && <HeroBanner />}

      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          {searchQuery && (
            <>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Search Results</h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Find your favorite movies</p>
            </>
          )}
          <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
        </div>

        {data && (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {searchQuery ? `Search Results for "${searchQuery}"` : "Popular Movies"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{data.total_results.toLocaleString()} movies found</p>
            </div>

            <MoviesList movies={data.results} />

            {data.total_pages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.min(data.total_pages, 500)}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
