
import Header from '../components/Header.jsx'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/4c85f2d8-hero.jpg')] bg-cover bg-center">
      <div className="bg-black/70 min-h-screen">
        <Header />
        <main className="pt-40 max-w-3xl mx-auto text-center px-6 text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold">Unlimited movies, TV shows, and more.</h1>
          <p className="mt-4 text-lg">Watch anywhere. Cancel anytime.</p>
          <Link to="/signup" className="inline-block mt-8 px-6 py-3 bg-red-600 rounded text-lg font-bold">Get Started</Link>
        </main>
      </div>
    </div>
  )
}
