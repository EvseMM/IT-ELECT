import React from 'react';
import { Film, Flame, Star, Heart, Wifi, WifiOff } from 'lucide-react';

/**
 * Header Component (IT ELEC 1 Laboratory Exam - Step 2)
 * Displays application branding, category navigation links, and online status badge.
 */
export default function Header({ activeTab, setActiveTab, favoritesCount, isOnline }) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-900/90 border-b border-slate-800 transition-colors shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Course Info */}
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setActiveTab('popular')}
            title="Go to Popular Movies"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-200">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                  PWA Movie Site
                </span>
                <span className="hidden md:inline px-2 py-0.5 text-[10px] font-bold rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  TMDB API
                </span>
              </div>
              <span className="hidden sm:block text-xs text-slate-400 font-medium">
                IT ELEC 1 • Progressive Web App
              </span>
            </div>
          </div>

          {/* Nav Tabs & Status */}
          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-sm">
              <button
                onClick={() => setActiveTab('popular')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'popular'
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Popular</span>
              </button>

              <button
                onClick={() => setActiveTab('top_rated')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'top_rated'
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="hidden sm:inline">Top Rated</span>
              </button>

              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'favorites'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-rose-400'
                }`}
              >
                <Heart className="w-4 h-4 fill-current" />
                <span className="hidden sm:inline">Saved</span>
                {favoritesCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 bg-white/20 text-xs rounded-full font-bold">
                    {favoritesCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Network Indicator */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                isOnline
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-950/40 border-rose-500/30 text-rose-400'
              }`}
              title={isOnline ? 'Online' : 'Offline'}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
