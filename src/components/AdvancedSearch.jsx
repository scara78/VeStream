'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Star, Calendar, TrendingUp, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useInfiniteDiscover, useGenres } from '@/hooks/useMovieData';
import { ResponsiveVirtualGrid } from '@/components/VirtualGrid';
import Link from 'next/link';
import { MovieCardSkeleton } from '@/components/Skeletons';

/**
 * Advanced Search Component
 * Full-featured search with filters, sorting, and infinite scroll
 */
export default function AdvancedSearch() {
  const [filters, setFilters] = useState({
    mediaType: 'movie',
    sortBy: 'popularity.desc',
    genres: [],
    yearFrom: '',
    yearTo: '',
    ratingFrom: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  const { data: genresData } = useGenres(filters.mediaType);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteDiscover(filters.mediaType, {
    with_genres: filters.genres.join(','),
    'primary_release_date.gte': filters.yearFrom ? `${filters.yearFrom}-01-01` : undefined,
    'primary_release_date.lte': filters.yearTo ? `${filters.yearTo}-12-31` : undefined,
    'vote_average.gte': filters.ratingFrom || undefined,
    sort_by: filters.sortBy
  });

  // Flatten pages into single array
  const items = data?.pages.flatMap(page => page.results.map(item => ({
    id: item.id,
    title: item.title || item.name,
    posterPath: item.poster_path,
    rating: item.vote_average,
    releaseDate: item.release_date || item.first_air_date,
    mediaType: filters.mediaType
  }))) || [];

  const handleGenreToggle = (genreId) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genreId)
        ? prev.genres.filter(g => g !== genreId)
        : [...prev.genres, genreId]
    }));
  };

  const clearFilters = () => {
    setFilters({
      mediaType: 'movie',
      sortBy: 'popularity.desc',
      genres: [],
      yearFrom: '',
      yearTo: '',
      ratingFrom: ''
    });
  };

  const sortOptions = [
    { value: 'popularity.desc', label: 'Most Popular' },
    { value: 'popularity.asc', label: 'Least Popular' },
    { value: 'vote_average.desc', label: 'Highest Rated' },
    { value: 'vote_average.asc', label: 'Lowest Rated' },
    { value: 'release_date.desc', label: 'Newest First' },
    { value: 'release_date.asc', label: 'Oldest First' },
    { value: 'title.asc', label: 'A-Z' },
    { value: 'title.desc', label: 'Z-A' }
  ];

  const activeFiltersCount =
    filters.genres.length +
    (filters.yearFrom ? 1 : 0) +
    (filters.yearTo ? 1 : 0) +
    (filters.ratingFrom ? 1 : 0);

  return (
    <div className="min-h-screen bg-black pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Search className="w-10 h-10 text-[#00ff88]" />
            Discover
          </h1>
          <p className="text-gray-400">Find your next favorite movie or TV show</p>
        </div>

        {/* Controls */}
        <div className="mb-8 space-y-4">
          {/* Media Type & Sort */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Media Type Toggle */}
            <div className="flex gap-2">
              <Button
                onClick={() => setFilters(prev => ({ ...prev, mediaType: 'movie' }))}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  filters.mediaType === 'movie'
                    ? 'bg-[#00ff88] text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Movies
              </Button>
              <Button
                onClick={() => setFilters(prev => ({ ...prev, mediaType: 'tv' }))}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  filters.mediaType === 'tv'
                    ? 'bg-[#00ff88] text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                TV Shows
              </Button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-[#00ff88]/50 focus:outline-none"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-black">
                  {option.label}
                </option>
              ))}
            </select>

            {/* Filter Toggle */}
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                showFilters
                  ? 'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/50'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="bg-[#00ff88] text-black ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <Button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 font-semibold"
              >
                <X className="w-4 h-4" />
                Clear All
              </Button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-6">
              {/* Genres */}
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#00ff88]" />
                  Genres
                </h3>
                <div className="flex flex-wrap gap-2">
                  {genresData?.genres?.map(genre => (
                    <button
                      key={genre.id}
                      onClick={() => handleGenreToggle(genre.id)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        filters.genres.includes(genre.id)
                          ? 'bg-[#00ff88] text-black'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year Range */}
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#00ff88]" />
                  Release Year
                </h3>
                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="From"
                    value={filters.yearFrom}
                    onChange={(e) => setFilters(prev => ({ ...prev, yearFrom: e.target.value }))}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-[#00ff88]/50 focus:outline-none"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                  <input
                    type="number"
                    placeholder="To"
                    value={filters.yearTo}
                    onChange={(e) => setFilters(prev => ({ ...prev, yearTo: e.target.value }))}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-[#00ff88]/50 focus:outline-none"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#00ff88]" />
                  Minimum Rating
                </h3>
                <input
                  type="number"
                  placeholder="e.g., 7.0"
                  value={filters.ratingFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, ratingFrom: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-[#00ff88]/50 focus:outline-none"
                  min="0"
                  max="10"
                  step="0.1"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div>
          <div className="mb-4 text-gray-400">
            {isLoading ? 'Loading...' : `Found ${items.length}+ results`}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <ResponsiveVirtualGrid
              items={items}
              renderItem={(item) => (
                <Link
                  href={`/watch/${item.mediaType}/${item.id}`}
                  className="group block"
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-white/5 border border-white/10 hover:border-[#00ff88]/50 transition-all hover:scale-105">
                    <img
                      src={item.posterPath
                        ? `https://image.tmdb.org/t/p/w500${item.posterPath}`
                        : 'https://via.placeholder.com/500x750/1a1a2e/00f0ff?text=No+Image'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white text-sm font-semibold line-clamp-2 mb-1">
                          {item.title}
                        </p>
                        {item.releaseDate && (
                          <p className="text-gray-400 text-xs">
                            {new Date(item.releaseDate).getFullYear()}
                          </p>
                        )}
                      </div>
                    </div>
                    {item.rating > 0 && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-white/10 text-white border-white/20 text-xs">
                          <Star className="w-2 h-2 mr-1" fill="currentColor" />
                          {item.rating.toFixed(1)}
                        </Badge>
                      </div>
                    )}
                  </div>
                </Link>
              )}
              itemHeight={450}
              loadMore={fetchNextPage}
              hasMore={hasNextPage}
              loading={isFetchingNextPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
