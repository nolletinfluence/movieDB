export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p"

export const getImageUrl = (path: string | null, size = "w500"): string => {
  if (!path) {
    return "/placeholder.svg?height=750&width=500"
  }
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

export const getBackdropUrl = (path: string | null, size = "w1280"): string => {
  if (!path) {
    return "/placeholder.svg?height=720&width=1280"
  }
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}
