"use client"

import { useMemo } from "react"
import { MovieCard } from "@/entities/movie/ui/movie-card"
import type { Movie } from "@/shared/types/movie"

interface MoviesListProps {
  movies: Movie[]
}

export const MoviesList = ({ movies }: MoviesListProps) => {
  const movieCards = useMemo(() => {
    return movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
  }, [movies])

  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No movies found</p>
      </div>
    )
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-6 space-y-6">{movieCards}</div>
  )
}
