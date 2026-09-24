import React, { useState } from 'react';
import { Film, Calendar, Star, Heart, Eye } from 'lucide-react';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

/**
 * MovieCard Component (IT ELEC 1 Laboratory Exam - Step 2)
 * Displays a single movie's poster, title, rating, release year, and overview snippet.
 */
export default function MovieCard({ movie, onSelect, isFavorite, onToggleFavorite }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // TMDB poster URL construction
  const posterUrl = movie.poster_path 
    ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
    : (movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : null);

  const hasPoster = posterUrl && !imageError;
  const rating = movie.vote_average ? Number(movie.vote_average).toFixed(1) : (movie.imdbRating || null);
  const releaseYear = movie.release_date 
    ? movie.release_date.split('-')[0] 
    : (movie.Year || 'N/A');

  return (
    <div className="group relative bg-slate-900/90 rounded-2xl overflow-hidden border border-slate-800/80 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1.5 flex flex-col justify-between">
      
      {/* Movie Poster */}
      <div 
        className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950 cursor-pointer"
        onClick={() => onSelect(movie)}
      >
        {hasPoster ? (
          <img
            src={posterUrl}
            alt={movie.title || movie.Title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-400 bg-gradient-to-b from-slate-900 to-slate-950">
            <Film className="w-12 h-12 mb-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            <span className="text-sm font-medium line-clamp-2">{movie.title || movie.Title}</span>
            <span className="text-xs text-slate-500 mt-1">No Poster Available</span>
          </div>
        )}

        {/* Shimmer loading skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-slate-800 animate-pulse" />
        )}

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(movie);
            }}
            className="w-full py-2 bg-cyan-500/90 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 backdrop-blur-sm shadow-lg transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            View Movie Details
          </button>
        </div>

        {/* Rating Badge */}
        {rating && (
          <div className="absolute top-3 left-3">
            <span className="flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-lg bg-slate-900/80 backdrop-blur-md text-amber-400 border border-amber-500/30 shadow">
              <Star className="w-3 h-3 fill-current" />
              {rating}
            </span>
          </div>
        )}

        {/* Favorite Bookmark Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(movie);
          }}
          aria-label={isFavorite ? 'Remove from saved' : 'Save movie'}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-transform duration-200 hover:scale-110 ${
            isFavorite
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              : 'bg-slate-900/70 text-slate-300 hover:text-rose-400 hover:bg-slate-900/90'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Movie Details Info */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-2.5">
        <div>
          <h3 
            onClick={() => onSelect(movie)} 
            className="font-bold text-slate-100 text-base line-clamp-1 group-hover:text-cyan-400 transition-colors cursor-pointer"
            title={movie.title || movie.Title}
          >
            {movie.title || movie.Title}
          </h3>

          <div className="flex items-center justify-between mt-1 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {releaseYear}
            </span>
            {movie.vote_count ? (
              <span className="text-[11px] text-slate-500">{movie.vote_count.toLocaleString()} votes</span>
            ) : null}
          </div>

          {/* Overview Snippet */}
          <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {movie.overview || movie.Plot || 'No description available for this title.'}
          </p>
        </div>
      </div>

    </div>
  );
}
