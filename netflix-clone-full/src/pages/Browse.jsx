
import Header from '../components/Header.jsx'
import Banner from '../components/Banner.jsx'
import Row from '../components/Row.jsx'
import { tmdb } from '../services/tmdb.js'

export default function Browse() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-16">
        <Banner />
        <Row title="Trending Now" fetcher={tmdb.getTrending} />
        <Row title="Top Rated" fetcher={tmdb.getTopRated} />
        <Row title="Popular TV" fetcher={tmdb.getPopularTV} />
        <Row title="Action Movies" fetcher={() => tmdb.getByGenre(28)} />
        <Row title="Comedy Movies" fetcher={() => tmdb.getByGenre(35)} />
        <Row title="Horror Movies" fetcher={() => tmdb.getByGenre(27)} />
        <Row title="Romance Movies" fetcher={() => tmdb.getByGenre(10749)} />
      </main>
    </div>
  )
}
