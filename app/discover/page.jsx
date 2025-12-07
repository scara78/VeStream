'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  TrendingUp,
  Star,
  Calendar,
  Film,
  Tv,
  Sparkles,
  Filter,
  X,
  Grid,
  List,
  Search,
  Loader
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import AdvancedSearch from '@/components/AdvancedSearch';
import { InlineError } from '@/components/ErrorState';
import {
  getTMDBDiscover,
  getTMDBTrending,
  getTMDBGenres,
  formatTMDBData
} from '@/services/movieApi';

/**
 * Discover/Browse Page
 * Advanced search, filtering, and content discovery
 */
export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState('trending');
  const [mediaType, setMediaType] = useState('movie');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    rating: '',
    sortBy: 'popularity.desc'
  });

  const tabs = [
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'popular', label: 'Popular', icon: Sparkles },
    { id: 'top-rated', label: 'Top Rated', icon: Star },
    { id: 'upcoming', label: 'Upcoming', icon: Calendar },
    { id: 'advanced', label: 'Advanced Search', icon: Search }
  ];

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const movieGenres = await getTMDBGenres('movie');
        const tvGenres = await getTMDBGenres('tv');
        setGenres({
          movie: movieGenres.genres || [],
          tv: tvGenres.genres || []
        });
      } catch (err) {
        console.error('Error fetching genres:', err);
      }
    };
    fetchGenres();
  }, []);

  // Fetch content based on active tab and filters
  useEffect(() => {
    const fetchContent = async () => {
      if (activeTab === 'advanced') {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        let data;
        const params = {
          with_genres: filters.genre,
          'vote_average.gte': filters.rating ? parseFloat(filters.rating) : undefined,
          year: filters.year,
          sort_by: filters.sortBy
        };

        switch (activeTab) {
          case 'trending':
            data = await getTMDBTrending(mediaType, 'week');
            break;
          case 'popular':
            data = await getTMDBDiscover(mediaType, { ...params, sort_by: 'popularity.desc' });
            break;
          case 'top-rated':
            data = await getTMDBDiscover(mediaType, { ...params, sort_by: 'vote_average.desc', 'vote_count.gte': 1000 });
            break;
          case 'upcoming':
            if (mediaType === 'movie') {
              data = await getTMDBDiscover(mediaType, {
                ...params,
                'primary_release_date.gte': new Date().toISOString().split('T')[0],
                sort_by: 'primary_release_date.asc'
              });
            } else {
              data = await getTMDBDiscover(mediaType, { ...params, sort_by: 'first_air_date.desc' });
            }
            break;
          default:
            data = { results: [] };
        }

        const formatted = (data.results || []).slice(0, 60).map(formatTMDBData);
        setContent(formatted);
      } catch (err) {
        console.error('Error fetching content:', err);
        setContent([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [activeTab, mediaType, filters]);

  const currentGenres = genres[mediaType] || [];

  return (
    <div className="min-h-screen bg-black pt-20 px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Compass className="w-10 h-10 text-[#00ff88]" />
            Discover
          </h1>
          <p className="text-gray-400">Explore movies and TV shows by genre, year, and more</p>
        </div>

        {/* Media Type Toggle */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => setMediaType('movie')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${mediaType === 'movie'
              ? 'bg-[#00ff88] text-black'
              : 'bg-white/10 text-white hover:bg-white/20'
              }`}
          >
            <Film className="w-4 h-4" />
            Movies
          </button>
          <button
            onClick={() => setMediaType('tv')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${mediaType === 'tv'
              ? 'bg-[#00ff88] text-black'
              : 'bg-white/10 text-white hover:bg-white/20'
              }`}
          >
            <Tv className="w-4 h-4" />
            TV Shows
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                  ? 'bg-[#00ff88] text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* View Controls */}
          {activeTab !== 'advanced' && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${showFilters
                  ? 'bg-[#00ff88] text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                aria-label="Toggle filters"
              >
                <Filter className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                  ? 'bg-[#00ff88] text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                  ? 'bg-[#00ff88] text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && activeTab !== 'advanced' && (
          <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Filters</h3>
              <button
                onClick={() => setFilters({ genre: '', year: '', rating: '', sortBy: 'popularity.desc' })}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Reset All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Genre Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Genre</label>
                <select
                  value={filters.genre}
                  onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-white focus:border-[#00ff88] focus:outline-none"
                >
                  <option value="">All Genres</option>
                  {currentGenres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Year</label>
                <select
                  value={filters.year}
                  onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-white focus:border-[#00ff88] focus:outline-none"
                >
                  <option value="">All Years</option>
                  {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Min Rating</label>
                <select
                  value={filters.rating}
                  onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-white focus:border-[#00ff88] focus:outline-none"
                >
                  <option value="">Any Rating</option>
                  <option value="7">7+ Stars</option>
                  <option value="8">8+ Stars</option>
                  <option value="9">9+ Stars</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-white focus:border-[#00ff88] focus:outline-none"
                >
                  <option value="popularity.desc">Most Popular</option>
                  <option value="vote_average.desc">Highest Rated</option>
                  <option value="release_date.desc">Newest First</option>
                  <option value="release_date.asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div>
          {activeTab === 'advanced' ? (
            <AdvancedSearch />
          ) : loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader className="w-10 h-10 animate-spin text-[#00ff88]" />
            </div>
          ) : content.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your filters</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {content.map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {content.map((item) => (
                <MediaListItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Media Card Component (Grid View)
function MediaCard({ item }) {
  return (
    <Link
      href={`/watch/${item.type}/${item.id}`}
      className="group relative aspect-[2/3] rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-[#00ff88]/50 transition-all hover:scale-105"
    >
      <img
        src={
          item.poster || 'https://via.placeholder.com/500x750/1a1a2e/00f0ff?text=No+Image'
        }
        alt={item.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white text-sm font-semibold line-clamp-2">{item.title}</p>
          {item.rating && (
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-3 h-3 text-[#00ff88] fill-current" />
              <span className="text-white text-xs">{item.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// Media List Item Component (List View)
function MediaListItem({ item }) {
  return (
    <Link
      href={`/watch/${item.type}/${item.id}`}
      className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00ff88]/50 transition-all group"
    >
      <img
        src={
          item.poster || 'https://via.placeholder.com/200x300/1a1a2e/00f0ff?text=No+Image'
        }
        alt={item.title}
        className="w-16 h-24 object-cover rounded"
      />
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-semibold truncate">{item.title}</h3>
        <p className="text-gray-400 text-sm">{item.type === 'tv' ? 'TV Show' : 'Movie'}</p>
        {item.year && (
          <p className="text-gray-500 text-xs mt-1">{item.year}</p>
        )}
      </div>
      {item.rating && (
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-[#00ff88] fill-current" />
          <span className="text-white text-sm font-bold">{item.rating.toFixed(1)}</span>
        </div>
      )}
    </Link>
  );
}
