// src/pages/Account.jsx
import React from 'react'
import Header from '../components/Header.jsx'
import { useAuth } from '../services/auth.jsx'
import { useList } from '../hooks/useList.js'
import { tmdb } from '../services/tmdb.js'

export default function Account() {
  const { user, loading: authLoading } = useAuth()
  const uid = user?.uid
  const { items, loading } = useList(uid)

  return (
    <>
      <Header />
      <main className="px-6 py-8 max-w-6xl mx-auto">
        <h1 className="text-2xl text-white mb-4">My List</h1>

        {authLoading && <div className="text-white">Loading auth…</div>}
        {!uid && !authLoading && (
          <div className="text-gray-400">Please sign in to see your list.</div>
        )}

        {loading && <div className="text-white">Loading list…</div>}

        {!loading && items.length === 0 && uid && (
          <div className="text-gray-400">You have no saved items yet.</div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {items.map((m) => (
            <div key={m.id} className="bg-zinc-900 rounded overflow-hidden">
              <img
                src={tmdb.image(m.poster_path || m.backdrop_path, 'w342')}
                srcSet={`${tmdb.image(m.poster_path || m.backdrop_path,'w185')} 185w, ${tmdb.image(m.poster_path || m.backdrop_path,'w342')} 342w`}
                sizes="(max-width:640px) 45vw, (max-width:1024px) 22vw, 200px"
                loading="lazy"
                decoding="async"
                alt={m.title || 'Saved item'}
                className="w-full h-64 object-cover"
              />
              <div className="p-3">
                <h3 className="text-sm text-white truncate">{m.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
