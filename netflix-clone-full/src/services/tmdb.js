// src/services/tmdb.js
import axios from 'axios'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
if (!API_KEY) {
  throw new Error(
    'VITE_TMDB_API_KEY missing. Set it in your local .env (do not commit keys to repo).'
  )
}

const client = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 10000,
})

export const tmdb = {
  /**
   * Construct image URL for TMDB images.
   * size example: 'w185', 'w342', 'w500', 'w1280'
   */
  image: (path, size = 'w500') => {
    if (!path) return ''
    return `https://image.tmdb.org/t/p/${size}${path}`
  },

  async fetch(path, params = {}) {
    const res = await client.get(path, {
      params: { api_key: API_KEY, language: 'en-US', include_adult: false, ...params },
    })
    return res.data
  },

  // Helper endpoints
  async getTrending(type = 'movie', timeWindow = 'week') {
    return this.fetch(`/trending/${type}/${timeWindow}`)
  },

  async getPopular(type = 'movie', page = 1) {
    return this.fetch(`/movie/popular`, { page })
  },

  async search(query, page = 1) {
    return this.fetch('/search/multi', { query, page })
  },

  async getDetails(type, id) {
    return this.fetch(`/${type}/${id}`)
  },

  async getVideos(type, id) {
    return this.fetch(`/${type}/${id}/videos`)
  },
}
