// src/pages/Search.jsx
import React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import { tmdb } from '../services/tmdb.js'

function useDebounced(value, delay = 300) {
  const [debounced, setDebounced] = React.useState(value)
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const q = searchParams.get('q') || ''
  const [query, setQuery] = React.useState(q)
  const debouncedQuery = useDebounced(query, 300)

  const [results, setResults] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    if (!debouncedQuery) {
      setResults([])
      setLoading(false)
      setError(null)
      return
    }
    let mounted = true
    setLoading(true)
    setError(null)
    ;(async () => {
      try {
        const res = await tmdb.search(debouncedQuery, 1)
        if (!mounted) return
        setResults(res.results || [])
      } catch (err) {
        if (!mounted) return
        console.error(err)
        setError('Failed to fetch search results.')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [debouncedQuery])

  function onSubmit(e) {
    e.preventDefault()
    if (query.trim()) {
      setSearchParams({ q: query.trim() })
      // navigate already handled by searchParams binding
    } else {
      setSearchParams({})
    }
  }

  return (
    <>
      <Header />
      <main className="px-4 py-6 max-w-6xl mx-auto">
        <form onSubmit={onSubmit} className="mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, shows, people..."
            className="w-full rounded p-3 bg-gray-800 text-white"
            aria-label="Search"
          />
        </form>

        {loading && <div className="text-white">Searching…</div>}
        {error && <div className="text-red-400">{error}</div>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {results.map((r) => (
            <article key={r.id} className="bg-zinc-900 rounded overflow-hidden">
              <img
                src={tmdb.image(r.poster_path || r.profile_path || r.backdrop_path, 'w342')}
                srcSet={`${tmdb.image(r.poster_path || r.profile_path || r.backdrop_path,'w185')} 185w, ${tmdb.image(r.poster_path || r.profile_path || r.backdrop_path,'w342')} 342w`}
                sizes="(max-width:640px) 45vw, (max-width:1024px) 22vw, 200px"
                loading="lazy"
                decoding="async"
                alt={r.title || r.name || 'Result'}
                className="w-full h-64 object-cover"
              />
              <div className="p-3">
                <h3 className="text-sm text-white truncate">{r.title || r.name}</h3>
                <p className="text-xs text-gray-400">{r.media_type}</p>
              </div>
            </article>
          ))}
        </div>

        {!loading && results.length === 0 && debouncedQuery && (
          <div className="mt-6 text-gray-400">No results found.</div>
        )}
      </main>
    </>
  )
}
