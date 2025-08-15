
import { useAuth } from '../services/auth.jsx'
import Header from '../components/Header.jsx'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Profiles() {
  const { profile, setProfile, user } = useAuth()
  const [name, setName] = useState(profile?.name || (user?.email?.split('@')[0] || 'User'))
  const navigate = useNavigate()

  const choose = e => {
    e.preventDefault()
    setProfile({ name })
    navigate('/browse')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="pt-28 max-w-md mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Who's watching?</h2>
        <form onSubmit={choose} className="space-y-4">
          <input value={name} onChange={e=>setName(e.target.value)} className="w-full p-3 bg-neutral-800 rounded text-center text-lg font-semibold" />
          <button className="w-full p-3 bg-red-600 rounded font-semibold">Continue</button>
        </form>
      </div>
    </div>
  )
}
