import React from 'react';
import { Search, X, Sparkles } from 'lucide-react';

/**
 * Searchbar Component (IT ELEC 1 Laboratory Exam - Step 2)
 * Manages search input with onChange and onSubmit handlers.
 */
export default function Searchbar({ 
  searchTerm, 
  setSearchTerm, 
  onSearch, 
  quickTags = ['Marvel', 'Batman', 'Avengers', 'Avatar', 'Spider-Man', 'Interstellar', 'Moana'] 
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  const handleTagClick = (tag) => {
    setSearchTerm(tag);
    onSearch(tag);
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-6 px-4">
      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search TMDB movies (e.g., Inception, Avengers, Spider-Man)..."
          className="w-full pl-11 pr-24 py-3.5 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 shadow-xl shadow-slate-950/40 backdrop-blur-sm transition-all"
        />

        <div className="absolute inset-y-0 right-1.5 flex items-center gap-1">
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold rounded-xl shadow-md transition-all active:scale-95"
          >
            Search
          </button>
        </div>
      </form>

      {/* Suggested Quick Tags */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-slate-400 flex items-center gap-1 font-medium shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Suggestions:
        </span>
        {quickTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleTagClick(tag)}
            className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-cyan-300 transition-all shrink-0"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
