
import { useState } from 'react'
import Header from '../components/Header.jsx'
import { useAuth } from '../services/auth.jsx'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async e => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/profiles')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="pt-28 max-w-md mx-auto px-6">
        <h2 className="text-3xl font-bold mb-6">Sign In</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <div className="bg-red-700/60 p-3 rounded">{error}</div>}
          <input className="w-full p-3 bg-neutral-800 rounded" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full p-3 bg-neutral-800 rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="w-full p-3 bg-red-600 rounded font-semibold">Sign In</button>
        </form>
        <p className="mt-4 text-neutral-300">New to Netflix? <Link to="/signup" className="text-white underline">Sign up now</Link></p>
      </div>
    </div>
  )
}
