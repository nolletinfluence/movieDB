import { api } from "./axios"
import type { MovieDetails, MoviesResponse, MovieWithVideo, MovieVideo } from "../types/movie"

export const moviesApi = {
  getPopularMovies: async (page = 1): Promise<MoviesResponse> => {
    try {
      const response = await api.get("/movie/popular", { params: { page } })
      return response.data
    } catch (error) {
      throw new Error("Failed to fetch popular movies")
    }
  },

  searchMovies: async (query: string, page = 1): Promise<MoviesResponse> => {
    try {
      const response = await api.get("/search/movie", { params: { query, page } })
      return response.data
    } catch (error) {
      throw new Error("Failed to search movies")
    }
  },

  getMovieDetails: async (id: number): Promise<MovieDetails> => {
    try {
      const response = await api.get(`/movie/${id}`, {
        params: { append_to_response: "credits,videos" },
      })
      return response.data
    } catch (error) {
      throw new Error("Failed to fetch movie details")
    }
  },

  getMovieVideos: async (id: number): Promise<MovieVideo[]> => {
    try {
      const response = await api.get(`/movie/${id}/videos`)
      return response.data.results
    } catch (error) {
      throw new Error("Failed to fetch movie videos")
    }
  },

  getTrendingMovies: async (): Promise<MoviesResponse> => {
    try {
      const response = await api.get("/trending/movie/week")
      return response.data
    } catch (error) {
      throw new Error("Failed to fetch trending movies")
    }
  },

  getPopularMoviesWithTrailers: async (): Promise<MovieWithVideo[]> => {
    try {
      const moviesResponse = await api.get("/movie/popular", { params: { page: 1 } })
      const movies = moviesResponse.data.results.slice(0, 8)

      const moviesWithTrailers = await Promise.all(
        movies.map(async (movie: any) => {
          try {
            const videosResponse = await api.get(`/movie/${movie.id}/videos`)
            const videos = videosResponse.data.results

            const trailer =
              videos.find(
                (video: MovieVideo) => video.site === "YouTube" && video.type === "Trailer" && video.official === true,
              ) ||
              videos.find(
                (video: MovieVideo) =>
                  video.site === "YouTube" && (video.type === "Trailer" || video.type === "Teaser"),
              )

            return {
              ...movie,
              trailer,
            }
          } catch (error) {
            return movie
          }
        }),
      )

      const withTrailers = moviesWithTrailers.filter((movie) => movie.trailer)
      return withTrailers.length >= 5 ? withTrailers : moviesWithTrailers.slice(0, 6)
    } catch (error) {
      throw new Error("Failed to fetch movies with trailers")
    }
  },
}
