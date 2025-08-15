// src/components/TrailerModal.jsx
import React from 'react'
import { tmdb } from '../services/tmdb.js'

export default function TrailerModal({ open, onClose, mediaType, id }) {
  const [videoKey, setVideoKey] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    if (!open) return
    let mounted = true
    setLoading(true)
    setError(null)
    setVideoKey(null)

    ;(async () => {
      try {
        const data = await tmdb.getVideos(mediaType, id)
        if (!mounted) return
        const yt = (data.results || []).find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
                   (data.results || []).find((v) => v.site === 'YouTube')
        setVideoKey(yt?.key ?? null)
      } catch (err) {
        if (!mounted) return
        setError('Failed to load trailer.')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [open, mediaType, id])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative bg-black rounded-lg w-full max-w-4xl overflow-hidden"
      >
        <button
          aria-label="Close trailer"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 text-white text-xl"
        >
          ✖
        </button>

        <div className="w-full h-96 bg-black flex items-center justify-center">
          {loading && <div className="text-white p-4">Loading trailer…</div>}
          {error && <div className="text-white p-4">{error}</div>}

          {!loading && !error && videoKey && (
            <iframe
              loading="lazy"
              title="Trailer"
              className="w-full h-full"
              srcDoc={`<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto;height:100%;object-fit:cover}span{height:64px;font-size:64px;display:block;text-align:center;color:white}</style><a href="https://www.youtube.com/embed/${videoKey}?autoplay=1"><img src="https://i.ytimg.com/vi/${videoKey}/hqdefault.jpg" alt="Trailer thumbnail"/><span>▶</span></a>`}
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}

          {!loading && !error && !videoKey && (
            <div className="text-white p-6">No trailer available.</div>
          )}
        </div>
      </div>
    </div>
  )
}
