
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../services/auth.jsx'

export default function Header() {
  const { user, logout, profile } = useAuth()
  const navigate = useNavigate()
  const loc = useLocation()
  const onSearch = e => {
    e.preventDefault()
    const q = new FormData(e.currentTarget).get('q')
    if(q) navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/70 to-transparent">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to={user ? '/browse' : '/'} className="text-red-600 font-extrabold text-2xl">NETFLIX</Link>
        {user ? (
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-4 text-sm text-neutral-200">
              <Link to="/browse" className={loc.pathname==='/browse'?'font-bold text-white':''}>Home</Link>
              <Link to="/search" className={loc.pathname==='/search'?'font-bold text-white':''}>Search</Link>
              <Link to="/account" className={loc.pathname==='/account'?'font-bold text-white':''}>My List</Link>
            </nav>
            <form onSubmit={onSearch} className="hidden md:block">
              <input name="q" placeholder="Search titles" className="bg-neutral-800 text-white rounded px-3 py-1.5 text-sm" />
            </form>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-neutral-700 grid place-items-center text-xs">
                {(profile?.name||user.email||'U')[0].toUpperCase()}
              </div>
              <button onClick={logout} className="px-3 py-1.5 rounded bg-red-600 text-white text-sm font-semibold">Logout</button>
            </div>
          </div>
        ) : (
          <nav className="flex items-center gap-3">
            <Link to="/login" className="px-3 py-1.5 rounded bg-white text-black text-sm font-semibold">Sign In</Link>
            <Link to="/signup" className="px-3 py-1.5 rounded bg-red-600 text-white text-sm font-semibold">Sign Up</Link>
          </nav>
        )}
      </div>
    </header>
  )
}
