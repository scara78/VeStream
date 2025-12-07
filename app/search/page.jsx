'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Film, Tv, Filter, X, Star, Calendar, TrendingUp } from 'lucide-react';
import { useTMDBSearch, useTMDBDiscover, useTMDBGenres } from '@/hooks/useTMDB';
import { formatTMDBData } from '@/services/movieApi';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import MovieCard from '@/components/MovieCard';
import { MovieCardSkeleton, ContentRowSkeleton } from '@/components/Skeletons';
import { InlineLoading } from '@/components/LoadingComponents';

function SearchContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const initialGenre = searchParams.get('genre') || '';

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
    const [mediaType, setMediaType] = useState('all'); // all, movie, tv
    const [selectedGenre, setSelectedGenre] = useState(initialGenre);
    const [yearFrom, setYearFrom] = useState('');
    const [yearTo, setYearTo] = useState('');
    const [sortBy, setSortBy] = useState('popularity.desc');
    const [showFilters, setShowFilters] = useState(false);

    // Sync state with URL params
    useEffect(() => {
        const q = searchParams.get('q');
        const g = searchParams.get('genre');

        if (q && q !== searchQuery) {
            setSearchQuery(q);
            setDebouncedQuery(q); // Set immediately to avoid debounce delay on navigation
        }

        if (g && g !== selectedGenre) {
            setSelectedGenre(g);
        }
    }, [searchParams]);

    // Debounce search query for manual typing
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery !== debouncedQuery) {
                setDebouncedQuery(searchQuery);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch genres for filters
    const { data: movieGenres } = useTMDBGenres('movie');
    const { data: tvGenres } = useTMDBGenres('tv');

    // Search or discover based on query/filters
    const isSearchMode = debouncedQuery.trim().length > 0;

    const searchResults = useTMDBSearch(debouncedQuery);

    const discoverParams = {
        sort_by: sortBy,
        ...(selectedGenre && { with_genres: selectedGenre }),
        ...(yearFrom && { 'release_date.gte': `${yearFrom}-01-01`, 'first_air_date.gte': `${yearFrom}-01-01` }),
        ...(yearTo && { 'release_date.lte': `${yearTo}-12-31`, 'first_air_date.lte': `${yearTo}-12-31` }),
    };

    const discoverResults = useTMDBDiscover(
        mediaType === 'all' ? 'movie' : mediaType,
        discoverParams
    );

    const { data, isLoading } = isSearchMode ? searchResults : discoverResults;

    const results = data?.results
        ?.filter(item => {
            if (mediaType === 'all') return item.media_type !== 'person';
            if (mediaType === 'movie') return item.media_type === 'movie' || !item.media_type;
            if (mediaType === 'tv') return item.media_type === 'tv';
            return true;
        })
        .map(formatTMDBData) || [];

    const genres = mediaType === 'tv' ? tvGenres?.genres : movieGenres?.genres;

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Header */}
            <div className="relative bg-gradient-to-b from-[#00ff88]/5 to-black/0 border-b border-white/5 pt-20 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white drop-shadow-2xl">
                        Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-cyan-400">Unlimited</span> Content
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Search millions of movies and TV shows from the world's largest database.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Search Bar */}
                <div className="max-w-4xl mx-auto mb-8 sticky top-20 z-40">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#00ff88]/20 to-cyan-400/20 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#00ff88] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search for movies, TV shows..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]/50 focus:ring-1 focus:ring-[#00ff88]/50 transition-all shadow-xl"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="max-w-4xl mx-auto mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        {/* Media Type Tabs - Scrollable on mobile */}
                        <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                            <div className="flex gap-2 bg-white/5 p-1 rounded-xl w-max">
                                {['all', 'movie', 'tv'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setMediaType(type)}
                                        className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${mediaType === type
                                            ? 'bg-[#00ff88] text-black shadow-lg shadow-[#00ff88]/20'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {type === 'all' ? 'All' : type === 'movie' ? 'Movies' : 'TV Shows'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {/* Advanced Filters Toggle */}
                            <Button
                                onClick={() => setShowFilters(!showFilters)}
                                variant="glass"
                                className={`flex-1 md:flex-none gap-2 rounded-xl border-white/10 ${showFilters ? 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/30' : ''}`}
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                                {(selectedGenre || yearFrom || yearTo) && (
                                    <Badge variant="jungle" className="ml-2">Active</Badge>
                                )}
                            </Button>

                            {/* Clear Filters */}
                            {(selectedGenre || yearFrom || yearTo) && (
                                <button
                                    onClick={() => {
                                        setSelectedGenre('');
                                        setYearFrom('');
                                        setYearTo('');
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-[#00ff88] transition-colors whitespace-nowrap"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Advanced Filters Panel */}
                    {showFilters && (
                        <div className="mt-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 space-y-6 animate-fade-in shadow-2xl">
                            {/* Genre Filter */}
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">Genre</label>
                                <select
                                    value={selectedGenre}
                                    onChange={(e) => setSelectedGenre(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88] transition-all appearance-none cursor-pointer hover:bg-white/5"
                                >
                                    <option value="">All Genres</option>
                                    {genres?.map((genre) => (
                                        <option key={genre.id} value={genre.id}>{genre.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Year Range */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">From Year</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 2020"
                                        value={yearFrom}
                                        onChange={(e) => setYearFrom(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88] transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">To Year</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 2024"
                                        value={yearTo}
                                        onChange={(e) => setYearTo(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88] transition-all"
                                    />
                                </div>
                            </div>

                            {/* Sort By */}
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88] transition-all appearance-none cursor-pointer hover:bg-white/5"
                                >
                                    <option value="popularity.desc">Most Popular</option>
                                    <option value="vote_average.desc">Highest Rated</option>
                                    <option value="release_date.desc">Newest First</option>
                                    <option value="release_date.asc">Oldest First</option>
                                    <option value="revenue.desc">Highest Grossing</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results */}
                <div className="max-w-7xl mx-auto">
                    {isLoading ? (
                        <ContentRowSkeleton />
                    ) : results.length > 0 ? (
                        <>
                            <h2 className="text-xl font-semibold mb-6 text-gray-300">
                                {isSearchMode
                                    ? `Found ${results.length} results for "${debouncedQuery}"`
                                    : `Showing ${results.length} titles`}
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                                {results.map((item, index) => (
                                    <MovieCard key={item.id} movie={item} index={index} />
                                ))}
                            </div>
                        </>
                    ) : searchQuery ? (
                        <div className="text-center py-12">
                            <Search className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                            <h3 className="text-xl font-semibold text-gray-400 mb-2">No results found</h3>
                            <p className="text-gray-500">Try adjusting your filters or search query</p>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-[#00ff88]/50" />
                            <h3 className="text-xl font-semibold text-gray-400 mb-2">Start exploring</h3>
                            <p className="text-gray-500">Search or use filters to discover content</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><InlineLoading /></div>}>
            <SearchContent />
        </Suspense>
    );
}
