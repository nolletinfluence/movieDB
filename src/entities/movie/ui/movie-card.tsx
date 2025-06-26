"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useCallback } from "react"
import type { Movie } from "@/shared/types/movie"
import { getImageUrl } from "@/shared/utils/image"

interface MovieCardProps {
  movie: Movie
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const posterUrl = useMemo(() => {
    return getImageUrl(movie.poster_path, "w500")
  }, [movie.poster_path])

  const releaseYear = useMemo(() => {
    return movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"
  }, [movie.release_date])

  const rating = useMemo(() => {
    return movie.vote_average.toFixed(1)
  }, [movie.vote_average])

  const handleClick = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("movies-return-url", window.location.pathname + window.location.search)
      localStorage.setItem("movies-scroll-position", window.scrollY.toString())
    }
  }, [])

  return (
    <Link href={`/movie/${movie.id}`} className="group block" onClick={handleClick}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:scale-[1.02] break-inside-avoid">
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm transition-all duration-300 group-hover:bg-blue-600">
            ⭐ {rating}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-gray-900 dark:text-white transition-colors duration-300">
            {movie.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 transition-colors duration-300">{releaseYear}</p>

          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed transition-colors duration-300">
            {movie.overview}
          </p>
        </div>
      </div>
    </Link>
  )
}