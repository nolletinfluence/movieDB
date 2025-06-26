"use client"

import Image from "next/image"
import { useMemo } from "react"
import type { MovieDetails } from "@/shared/types/movie"
import { getImageUrl, getBackdropUrl } from "@/shared/utils/image"

interface MovieDetailsProps {
  movie: MovieDetails
}

export const MovieDetailsComponent = ({ movie }: MovieDetailsProps) => {
  const posterUrl = useMemo(() => {
    return getImageUrl(movie.poster_path, "w500")
  }, [movie.poster_path])

  const backdropUrl = useMemo(() => {
    return getBackdropUrl(movie.backdrop_path, "w1280")
  }, [movie.backdrop_path])

  const movieGenres = useMemo(() => {
    return movie.genres.map((genre) => (
      <span
        key={genre.id}
        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
      >
        {genre.name}
      </span>
    ))
  }, [movie.genres])

  const topCast = useMemo(() => {
    return movie.credits?.cast.slice(0, 6).map((actor) => (
      <div key={actor.id} className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-2">
          <Image
            src={getImageUrl(actor.profile_path, "w185")}
            alt={actor.name}
            fill
            className="object-cover rounded-full"
          />
        </div>
        <p className="font-medium text-sm text-gray-900 dark:text-white">{actor.name}</p>
        <p className="text-gray-600 dark:text-gray-400 text-xs">{actor.character}</p>
      </div>
    ))
  }, [movie.credits?.cast])

  const topProductionCompanies = useMemo(() => {
    return movie.production_companies.slice(0, 4).map((company) => (
      <div key={company.id} className="text-center">
        <p className="font-medium text-sm text-gray-900 dark:text-white">{company.name}</p>
      </div>
    ))
  }, [movie.production_companies])

  return (
    <div className="max-w-6xl mx-auto">
      <div className="relative h-96 mb-8">
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          className="object-cover rounded-lg"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg" />

        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
          {movie.tagline && <p className="text-lg italic mb-2 opacity-90">{movie.tagline}</p>}
          <div className="flex items-center gap-4 text-lg">
            <span>⭐ {movie.vote_average.toFixed(1)}</span>
            <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}</span>
            {movie.runtime && <span>{movie.runtime} min</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="relative aspect-[2/3] mb-6">
            <Image
              src={posterUrl}
              alt={movie.title}
              fill
              className="object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Overview</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{movie.overview}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Genres</h3>
            <div className="flex flex-wrap gap-2">{movieGenres}</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="font-semibold text-gray-600 dark:text-gray-400">Status</h4>
              <p className="text-lg text-gray-900 dark:text-white">{movie.status}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-600 dark:text-gray-400">Original Language</h4>
              <p className="text-lg text-gray-900 dark:text-white uppercase">{movie.original_language}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-600 dark:text-gray-400">Budget</h4>
              <p className="text-lg text-gray-900 dark:text-white">
                {movie.budget > 0 ? `$${movie.budget.toLocaleString()}` : "N/A"}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-600 dark:text-gray-400">Revenue</h4>
              <p className="text-lg text-gray-900 dark:text-white">
                {movie.revenue > 0 ? `$${movie.revenue.toLocaleString()}` : "N/A"}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-600 dark:text-gray-400">Vote Count</h4>
              <p className="text-lg text-gray-900 dark:text-white">{movie.vote_count.toLocaleString()}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-600 dark:text-gray-400">Popularity</h4>
              <p className="text-lg text-gray-900 dark:text-white">{movie.popularity.toFixed(1)}</p>
            </div>
          </div>

          {movie.production_companies.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Production Companies</h3>
              <div className="flex flex-wrap gap-4">{topProductionCompanies}</div>
            </div>
          )}

          {movie.credits?.cast && movie.credits.cast.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Cast</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{topCast}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}