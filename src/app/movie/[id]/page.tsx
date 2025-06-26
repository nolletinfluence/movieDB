import { notFound } from "next/navigation"
import { MovieDetailsComponent } from "@/entities/movie/ui/movie-details"
import { moviesApi } from "@/shared/api/movies"

interface MoviePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params
  const movieId = Number.parseInt(id)

  if (isNaN(movieId)) {
    notFound()
  }

  try {
    const movie = await moviesApi.getMovieDetails(movieId)
    
    return (
      <div className="space-y-6">
        <MovieDetailsComponent movie={movie} />
      </div>
    )
  } catch (error) {
    notFound()
  }
}

export async function generateMetadata({ params }: MoviePageProps) {
  try {
    const { id } = await params
    const movieId = Number.parseInt(id)
    
    if (isNaN(movieId)) {
      return {
        title: 'Movie Not Found'
      }
    }

    const movie = await moviesApi.getMovieDetails(movieId)
    
    return {
      title: `${movie.title} - Movies App`,
      description: movie.overview,
      openGraph: {
        title: movie.title,
        description: movie.overview,
        images: movie.backdrop_path 
          ? [`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`]
          : [],
      },
    }
  } catch (error) {
    return {
      title: 'Movie Not Found'
    }
  }
}