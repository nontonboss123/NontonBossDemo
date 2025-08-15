
import { useEffect, useState } from 'react'
import { tmdb } from '../services/tmdb.js'
import TrailerModal from './TrailerModal.jsx'

export default function Banner() {
  const [item, setItem] = useState(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    async function load() {
      const data = await tmdb.getTrending()
      const pick = data.results?.[Math.floor(Math.random()*data.results.length)]
      setItem(pick)
    }
    load()
  }, [])

  if (!item) return <div className="h-[60vh] bg-neutral-900" />

  const title = item.title || item.name || item.original_name
  const backdrop = tmdb.image(item.backdrop_path, 'original')
  const overview = (item.overview || '').slice(0, 180) + (item.overview?.length > 180 ? '…' : '')

  return (
    <div className="relative h-[70vh]">
      <img src={backdrop} alt={title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      <div className="absolute bottom-16 left-8 right-8 max-w-3xl space-y-4">
        <h2 className="text-4xl md:text-6xl font-extrabold">{title}</h2>
        <p className="text-sm md:text-base text-neutral-200">{overview}</p>
        <div className="flex gap-3">
          <button onClick={()=>setOpen(true)} className="px-4 py-2 bg-white text-black rounded font-semibold">Play Trailer</button>
          <button className="px-4 py-2 bg-neutral-700 text-white rounded font-semibold">More Info</button>
        </div>
      </div>
      {open && <TrailerModal item={item} onClose={()=>setOpen(false)} />}
    </div>
  )
}
