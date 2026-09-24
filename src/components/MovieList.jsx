import React from 'react';
import MovieCard from './MovieCard';
import { Film, AlertCircle, Loader2 } from 'lucide-react';

/**
 * MovieList Component (IT ELEC 1 Laboratory Exam - Step 2 & Step 4)
 * Renders a responsive grid mapping the movies array to MovieCard components,
 * with loading spinner and error handling states.
 */
export default function MovieList({ 
  movies = [], 
  loading = false, 
  error = null, 
  onSelectMovie, 
  favorites = [], 
  onToggleFavorite 
}) {
  // Step 4: Loading State (Loading spinner & skeletons)
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center py-6 text-cyan-400">
          <Loader2 className="w-10 h-10 animate-spin mb-3" />
          <p className="text-sm font-semibold text-slate-300">Fetching movies from TMDB...</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, idx) => (
            <div key={idx} className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800 animate-pulse flex flex-col gap-3">
              <div className="aspect-[2/3] w-full bg-slate-800 rounded-xl" />
              <div className="h-5 bg-slate-800 rounded-md w-3/4" />
              <div className="h-3 bg-slate-800 rounded-md w-1/2" />
              <div className="h-10 bg-slate-800/60 rounded-md w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Step 4: Error Handling State
  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 rounded-2xl bg-rose-950/30 border border-rose-900/50 text-center text-slate-200">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h3 className="font-bold text-lg text-rose-400">Unable to load movies</h3>
        <p className="text-sm text-slate-400 mt-1">{error}</p>
      </div>
    );
  }

  // Empty Results State
  if (!movies || movies.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 text-center text-slate-400 px-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500">
          <Film className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-slate-200">No movies found</h3>
        <p className="text-sm text-slate-400 mt-1">
          Try searching for a different title or explore popular movies.
        </p>
      </div>
    );
  }

  // Step 4: Responsive Movie Grid mapping to MovieCard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => {
          const movieId = movie.id || movie.imdbID;
          const isFav = favorites.some((fav) => (fav.id || fav.imdbID) === movieId);
          return (
            <MovieCard
              key={movieId || movie.title}
              movie={movie}
              onSelect={onSelectMovie}
              isFavorite={isFav}
              onToggleFavorite={onToggleFavorite}
            />
          );
        })}
      </div>
    </div>
  );
}
