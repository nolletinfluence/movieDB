"use client"

import "./hero-banner.css"
import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { moviesApi } from "@/shared/api/movies"
import { getBackdropUrl } from "@/shared/utils/image"

export const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isManualChange, setIsManualChange] = useState(false)
  const videoRefs = useRef<(HTMLIFrameElement | null)[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { data: movies, isLoading } = useQuery({
    queryKey: ["movies-with-trailers"],
    queryFn: () => moviesApi.getPopularMoviesWithTrailers(),
    staleTime: 10 * 60 * 1000,
  })

  // Слушаем сообщения от YouTube iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.youtube.com") return
      
      try {
        const data = JSON.parse(event.data)
        
        // Когда видео заканчивается (state 0 = ended)
        if (data.event === "video-state-change" && data.info === 0) {
          console.log("Video ended, switching to next slide")
          if (movies && !isManualChange) {
            setCurrentSlide((prev) => (prev + 1) % movies.length)
          }
        }
      } catch (error) {
        // Игнорируем ошибки парсинга
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [movies, isManualChange])

  const setVideoTimer = useCallback(
    (videoIndex: number) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      const currentMovie = movies?.[currentSlide]
      
      // Разные таймеры для видео и изображений
      const duration = currentMovie?.trailer ? 120000 : 5000 // 2 минуты для видео, 5 сек для изображений

      timeoutRef.current = setTimeout(() => {
        if (movies && !isManualChange) {
          setCurrentSlide((prev) => (prev + 1) % movies.length)
        }
        setIsManualChange(false)
      }, duration)
    },
    [movies, isManualChange, currentSlide],
  )

  useEffect(() => {
    if (!movies || movies.length === 0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      return
    }

    setVideoTimer(currentSlide)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [currentSlide, movies, setVideoTimer])

  useEffect(() => {
    if (!movies || movies.length === 0) return

    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentSlide) {
        video.contentWindow?.postMessage('{"event":"command","func":"mute","args":[]}', "https://www.youtube.com")
      }
    })

    const currentVideo = videoRefs.current[currentSlide]
    if (currentVideo) {
      setTimeout(() => {
        currentVideo.contentWindow?.postMessage(
          '{"event":"command","func":"unMute","args":[]}',
          "https://www.youtube.com",
        )
        currentVideo.contentWindow?.postMessage(
          '{"event":"command","func":"setVolume","args":[20]}',
          "https://www.youtube.com",
        )
        // Подписываемся на события плеера
        currentVideo.contentWindow?.postMessage(
          '{"event":"listening","func":"addEventListener","args":["onStateChange"]}',
          "https://www.youtube.com",
        )
      }, 1000)
    }
  }, [currentSlide, movies])

  const nextSlide = useCallback(() => {
    if (movies) {
      setIsManualChange(true)
      setCurrentSlide((prev) => (prev + 1) % movies.length)
    }
  }, [movies])

  const prevSlide = useCallback(() => {
    if (movies) {
      setIsManualChange(true)
      setCurrentSlide((prev) => (prev - 1 + movies.length) % movies.length)
    }
  }, [movies])

  const handleSlideChange = useCallback((index: number) => {
    setIsManualChange(true)
    setCurrentSlide(index)
  }, [])

  const currentMovie = useMemo(() => {
    return movies?.[currentSlide]
  }, [movies, currentSlide])

  if (isLoading || !movies || movies.length === 0) {
    return (
      <div className="relative h-[70vh] bg-gradient-to-r from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Discover Amazing Movies</h1>
          <p className="text-xl">Browse through thousands of movies and find your next favorite</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[70vh] overflow-hidden bg-black">
      <div className="absolute inset-0">
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {movie.trailer && (
              <iframe
                ref={(el) => {
                  videoRefs.current[index] = el
                }}
                src={`https://www.youtube.com/embed/${movie.trailer.key}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=0&start=0&modestbranding=1&playsinline=1&enablejsapi=1&end=0&iv_load_policy=3&cc_load_policy=0&disablekb=1&fs=0&origin=${typeof window !== "undefined" ? window.location.origin : ""}`}
                className="w-full h-full object-cover scale-125 pointer-events-none"
                allow="autoplay; encrypted-media"
                allowFullScreen={false}
                title={`${movie.title} trailer`}
              />
            )}
            {!movie.trailer && movie.backdrop_path && (
              <div
                className="hero-banner-backdrop"
                style={{
                  '--backdrop-url': `url(${getBackdropUrl(movie.backdrop_path, "w1280")})`,
                } as React.CSSProperties}
              />
            )}
          </div>
        ))}

        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
      </div>

      <div className="relative z-10 h-full flex items-end pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">{currentMovie?.title}</h1>
            {currentMovie?.overview && (
              <p className="text-lg mt-4 line-clamp-2 opacity-90">
                {currentMovie.overview}
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-colors z-20"
        aria-label="Previous movie"
        title="Previous movie"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-colors z-20"
        aria-label="Next movie"
        title="Next movie"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-6 right-6 flex gap-2 z-20">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            title={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}