import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Searchbar from './components/Searchbar';
import MovieList from './components/MovieList';
import { Star, Clock, Calendar, Film, X, Heart, Globe } from 'lucide-react';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';

// Fallback popular movies dataset for offline PWA demonstration
const OFFLINE_FALLBACK_MOVIES = [
  {
    id: 1108427,
    title: 'Moana 2',
    release_date: '2024-11-27',
    vote_average: 7.3,
    poster_path: '/gaet1xQ2nxrG0V1Ep9T20ZMNEIC.jpg',
    backdrop_path: '/c6BPbkO5Npt1OdwttAxCFo06wtH.jpg',
    overview: 'After receiving an unexpected call from her wayfinding ancestors, Moana journeys to the far seas of Oceania and into dangerous, long-lost waters for an adventure unlike anything she\'s ever faced.'
  },
  {
    id: 1084244,
    title: 'Toy Story 5',
    release_date: '2026-06-17',
    vote_average: 8.4,
    poster_path: '/sfQtVlIHljToOwYjhe21KPGzZWK.jpg',
    backdrop_path: '/qjTqY5coNiz6sVtPng40IzltsoN.jpg',
    overview: 'When Bonnie receives a Lilypad tablet as a gift and becomes obsessed, Buzz, Woody, Jessie and the rest of the gang\'s jobs become exponentially harder when they have to go head to head with the all-new threat to playtime.'
  },
  {
    id: 1288445,
    title: 'Mutiny',
    release_date: '2026-08-19',
    vote_average: 6.4,
    poster_path: '/pu2VxGlpGwffOx292w18b1tv96j.jpg',
    backdrop_path: '/e2QAGrEmbpmZpMymDRkDisJkvg9.jpg',
    overview: 'After witnessing his billionaire boss\' murder and being framed for the crime, Cole Reed boards a cargo ship on a one-man crusade to avenge his boss\' death only to discover an international conspiracy.'
  },
  {
    id: 157336,
    title: 'Interstellar',
    release_date: '2014-11-05',
    vote_average: 8.4,
    poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop_path: '/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.'
  },
  {
    id: 299534,
    title: 'Avengers: Endgame',
    release_date: '2019-04-24',
    vote_average: 8.3,
    poster_path: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    backdrop_path: '/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
    overview: 'After the devastating events of Avengers: Infinity War, the universe is in ruins due to the efforts of the Mad Titan, Thanos. With the help of remaining allies, the Avengers assemble once more.'
  },
  {
    id: 155,
    title: 'The Dark Knight',
    release_date: '2008-07-16',
    vote_average: 8.5,
    poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop_path: '/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    overview: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.'
  }
];

/**
 * Main Application Component (IT ELEC 1 Laboratory Exam)
 * Manages State (movies, search, loading, error, selectedMovie, favorites)
 * Handles TMDB API fetching and PWA offline persistence.
 */
function App() {
  // Step 1: TMDB API Configuration
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '4e44d9029b1270a757cddc766a1bcb63';
  const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';

  // Step 2 & 4: Application States
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // States for Movie Detail Modal
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Navigation & Category states
  const [activeTab, setActiveTab] = useState('popular'); // 'popular', 'top_rated', 'favorites'
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Favorites state persisted with localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('tmdb_pwa_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Track online/offline status for PWA
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('tmdb_pwa_favorites', JSON.stringify(favorites));
    } catch (err) {
      console.error('Failed to save favorites to localStorage', err);
    }
  }, [favorites]);

  // Toggle saving movie to favorites
  const toggleFavorite = (movie) => {
    setFavorites((prev) => {
      const movieId = movie.id || movie.imdbID;
      const exists = prev.some((fav) => (fav.id || fav.imdbID) === movieId);
      if (exists) {
        return prev.filter((fav) => (fav.id || fav.imdbID) !== movieId);
      } else {
        return [...prev, movie];
      }
    });
  };

  // Step 3: Fetch movies from TMDB API (from Slide 5)
  const fetchMovies = useCallback(async (query, category = activeTab) => {
    setLoading(true);
    setError(null);

    try {
      let url = '';
      if (query && query.trim()) {
        url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query.trim())}`;
      } else if (category === 'top_rated') {
        url = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`;
      } else {
        url = `${BASE_URL}/movie/popular?api_key=${API_KEY}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setMovies(data.results);
      } else if (data.results && data.results.length === 0) {
        setMovies([]);
      } else {
        throw new Error(data.status_message || 'Failed to fetch movies');
      }
    } catch (err) {
      console.warn('API fetch failed or offline, loading fallback dataset:', err);
      // PWA offline resilience: serve fallback dataset
      if (query) {
        const filtered = OFFLINE_FALLBACK_MOVIES.filter((m) =>
          m.title.toLowerCase().includes(query.toLowerCase())
        );
        setMovies(filtered);
      } else {
        setMovies(OFFLINE_FALLBACK_MOVIES);
      }
      if (!navigator.onLine) {
        setError(null); // Silent offline fallback
      } else if (!query) {
        setError('Failed to fetch movies. Displaying offline cached collection.');
      }
    } finally {
      setLoading(false);
    }
  }, [API_KEY, BASE_URL, activeTab]);

  // Initial load: Fetch popular movies
  useEffect(() => {
    fetchMovies('');
  }, []);

  // Fetch full movie details when a movie card is clicked (Step 4)
  useEffect(() => {
    if (!selectedMovie) {
      setMovieDetails(null);
      return;
    }

    let isMounted = true;
    const fetchDetails = async () => {
      setDetailsLoading(true);
      try {
        const movieId = selectedMovie.id;
        if (movieId) {
          const res = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
          if (res.ok) {
            const data = await res.json();
            if (isMounted) {
              setMovieDetails(data);
              return;
            }
          }
        }
        if (isMounted) {
          setMovieDetails(selectedMovie);
        }
      } catch {
        if (isMounted) {
          setMovieDetails(selectedMovie);
        }
      } finally {
        if (isMounted) {
          setDetailsLoading(false);
        }
      }
    };

    fetchDetails();

    // Close modal on Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedMovie(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      isMounted = false;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedMovie, API_KEY, BASE_URL]);

  // Handle category navigation tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery('');
    if (tab === 'popular' || tab === 'top_rated') {
      fetchMovies('', tab);
    }
  };

  // Determine movies to display (activeTab favorites vs normal list)
  const displayedMovies = activeTab === 'favorites' ? favorites : movies;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* Step 2: Header Component */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        favoritesCount={favorites.length}
        isOnline={isOnline}
      />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Offline Warning Banner for PWA */}
        {!isOnline && (
          <div className="bg-amber-500/20 border-b border-amber-500/40 text-amber-200 text-xs sm:text-sm py-2 px-4 text-center">
            ⚠️ You are browsing in offline mode. Cached movies and saved favorites are available.
          </div>
        )}

        {/* Hero & Search Section */}
        <section className="pt-8 pb-4 text-center px-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Explore <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Trending Movies</span>
          </h1>
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Discover top-rated cinema and blockbusters powered by <strong>React</strong>, <strong>TMDB API</strong>, and <strong>Tailwind CSS</strong>.
          </p>

          {/* Step 2: SearchBar Component */}
          {activeTab !== 'favorites' && (
            <Searchbar
              searchTerm={searchQuery}
              setSearchTerm={setSearchQuery}
              onSearch={(query) => fetchMovies(query)}
            />
          )}

          {activeTab === 'favorites' && (
            <div className="max-w-3xl mx-auto mt-6 px-4">
              <h2 className="text-xl font-semibold text-rose-400 flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 fill-current" />
                Saved Movies ({favorites.length})
              </h2>
            </div>
          )}
        </section>

        {/* Step 2 & 4: MovieList Component (Grid, Loading, Error) */}
        <MovieList
          movies={displayedMovies}
          loading={loading}
          error={error}
          onSelectMovie={(movie) => setSelectedMovie(movie)}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      </main>

      {/* Step 4: Movie Detail Modal Dialog */}
      {selectedMovie && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedMovie(null)}
        >
          <div 
            className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMovie(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors shadow-lg"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Poster */}
            <div className="md:w-2/5 aspect-[2/3] md:aspect-auto bg-slate-950 flex-shrink-0 relative">
              {selectedMovie.poster_path || selectedMovie.Poster ? (
                <img
                  src={
                    selectedMovie.poster_path 
                      ? `${TMDB_IMAGE_BASE}${selectedMovie.poster_path}`
                      : selectedMovie.Poster
                  }
                  alt={selectedMovie.title || selectedMovie.Title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-slate-500">
                  <Film className="w-16 h-16 mb-2" />
                  <span className="text-xs">No Poster Available</span>
                </div>
              )}
            </div>

            {/* Movie Info */}
            <div className="p-6 md:w-3/5 flex flex-col justify-between gap-4">
              <div>
                {/* Genres / Tagline */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {movieDetails?.genres?.map((genre) => (
                    <span 
                      key={genre.id}
                      className="px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {selectedMovie.title || selectedMovie.Title}
                </h2>

                {movieDetails?.tagline && (
                  <p className="italic text-xs text-slate-400 mt-1">"{movieDetails.tagline}"</p>
                )}

                {/* Rating & Release Date */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    {selectedMovie.release_date || selectedMovie.Year || 'N/A'}
                  </span>

                  {movieDetails?.runtime ? (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      {movieDetails.runtime} min
                    </span>
                  ) : null}

                  {(selectedMovie.vote_average || selectedMovie.imdbRating) && (
                    <span className="flex items-center gap-1 font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {Number(selectedMovie.vote_average || selectedMovie.imdbRating).toFixed(1)} / 10
                    </span>
                  )}
                </div>

                {/* Full Overview */}
                <div className="mt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Overview
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {detailsLoading ? (
                      <span className="inline-block w-full h-20 bg-slate-800 animate-pulse rounded-lg" />
                    ) : (
                      movieDetails?.overview || selectedMovie.overview || selectedMovie.Plot || 'No plot overview available.'
                    )}
                  </p>
                </div>

                {/* Production Info */}
                {movieDetails?.production_companies?.length > 0 && (
                  <div className="mt-3 text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">Studios: </span>
                    {movieDetails.production_companies.map((c) => c.name).slice(0, 3).join(', ')}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleFavorite(selectedMovie)}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    favorites.some((fav) => (fav.id || fav.imdbID) === (selectedMovie.id || selectedMovie.imdbID))
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favorites.some((fav) => (fav.id || fav.imdbID) === (selectedMovie.id || selectedMovie.imdbID)) ? 'fill-current' : ''}`} />
                  {favorites.some((fav) => (fav.id || fav.imdbID) === (selectedMovie.id || selectedMovie.imdbID)) ? 'Saved in Favorites' : 'Add to Favorites'}
                </button>

                {movieDetails?.homepage && (
                  <a
                    href={movieDetails.homepage}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 transition-all"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>IT ELEC 1 - Mobile Application Development | Laboratory Exam - PWA Movie Site</p>
        <p className="mt-1 text-slate-600">Powered by React, TMDB API, and Tailwind CSS</p>
      </footer>
    </div>
  );
}

export default App;
