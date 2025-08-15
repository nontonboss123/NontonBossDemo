import { useEffect, useState, useMemo, useRef } from "react";
import { tmdb } from "../services/tmdb.js";
import { useList } from "../hooks/useList.js";

function Card({ m, index, showNumber }) {
  const { isSaved, toggleSave } = useList();
  const name = m.title || m.name || m.original_name;
  const img = tmdb.image(m.backdrop_path || m.poster_path, "w780");
  const saved = isSaved(m.id);
  const year = (m.release_date || m.first_air_date || "").slice(0, 4);
  const rating = m.vote_average ? m.vote_average.toFixed(1) : null;

  return (
    <div
      className="relative flex-shrink-0 w-64 group cursor-pointer fade-in overflow-visible"
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      {showNumber && (
        <span className="absolute top-1 left-1 text-4xl font-extrabold text-white number-outline z-30">
          {index + 1}
        </span>
      )}

      <div className="relative overflow-visible">
        <div
          className={`relative rounded-lg shadow-md aspect-[16/9] bg-black transform transition-transform duration-300 ease-out group-hover:scale-[1.35] group-hover:-translate-y-6 ${
            index % 2 === 0
              ? "group-hover:-translate-x-4"
              : "group-hover:translate-x-4"
          } z-20`}
          style={{ transformOrigin: "center center" }}
        >
          <div className="w-full h-full overflow-hidden rounded-lg">
            <img
              src={img}
              alt={name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-sm font-semibold truncate">{name}</p>
            <div className="flex items-center gap-2 text-xs opacity-80">
              {year && <span>{year}</span>}
              {rating && (
                <span className="px-1 bg-yellow-500 text-black rounded text-[10px] font-bold">
                  ★ {rating}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => toggleSave(m)}
        className={
          "absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold shadow-md z-30 " +
          (saved ? "bg-red-600" : "bg-neutral-700")
        }
      >
        {saved ? "✓ In My List" : "+ My List"}
      </button>
    </div>
  );
}

export default function Row({ title, fetcher }) {
  const [items, setItems] = useState([]);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const showNumber = ["Trending Now", "Top Rated", "Popular TV"].includes(title);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetcher();
        if (mounted) setItems(res.results || []);
      } catch (err) {
        console.error("Error fetching row:", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [fetcher]);

  const filled = useMemo(
    () => items.filter((x) => x.backdrop_path || x.poster_path),
    [items]
  );

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons);
    return () => el.removeEventListener("scroll", updateScrollButtons);
  }, [filled.length]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.9;
    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="text-white px-6 mt-6 relative overflow-visible">
      <h3 className="text-xl font-bold mb-3">{title}</h3>

      <div className="relative overflow-visible">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-40 p-2 rounded-full bg-gradient-to-r from-black/70 to-transparent shadow-lg hover:from-black/90 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}

        <div
          className={`absolute left-0 top-0 bottom-0 w-12 pointer-events-none z-30 transition-opacity duration-300 ${
            canScrollLeft
              ? "opacity-100 bg-gradient-to-r from-black/80 to-transparent"
              : "opacity-0"
          }`}
        ></div>

        <div
          className={`absolute right-0 top-0 bottom-0 w-12 pointer-events-none z-30 transition-opacity duration-300 ${
            canScrollRight
              ? "opacity-100 bg-gradient-to-l from-black/80 to-transparent"
              : "opacity-0"
          }`}
        ></div>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto overflow-y-visible pb-4 scrollbar-hide"
        >
          {filled.map((m, i) => (
            <Card key={m.id} m={m} index={i} showNumber={showNumber} />
          ))}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-40 p-2 rounded-full bg-gradient-to-l from-black/70 to-transparent shadow-lg hover:from-black/90 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}
