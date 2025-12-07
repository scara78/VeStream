'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import MovieCard from '@/components/MovieCard';
import Navigation from '@/components/Navigation';
import ErrorState from '@/components/ErrorState';
import {
    getTMDBTrending,
    getTMDBPopular,
    getTMDBTopRated,
    searchTMDB,
    formatTMDBData,
    getTMDBDetails
} from '@/services/movieApi';
import { useLibrary } from '@/hooks/useLibrary';
import {
    Play,
    Star,
    TrendingUp,
    Film,
    Tv,
    Search,
    ChevronRight,
    Flame,
    Loader,
    Volume2,
    VolumeX,
    Info
} from 'lucide-react';

/**
 * VeStream Homepage
 * Pro-level cinematic streaming experience
 */
export default function HomePage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [heroMovies, setHeroMovies] = useState([]);
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { history } = useLibrary();

    // Filter history for items with progress > 0
    const continueWatching = history.filter(item => item.progress > 0 && item.progress < (item.duration * 0.95));

    // Handle scroll effect for header
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch TMDB content
    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            setError(null);
            try {
                const [trending, popular, topRated] = await Promise.all([
                    getTMDBTrending('all', 'week'),
                    getTMDBPopular('movie'),
                    getTMDBTopRated('movie')
                ]);

                const formattedTrending = trending.results.slice(0, 20).map(formatTMDBData);
                setTrendingMovies(formattedTrending);
                setPopularMovies(popular.results.slice(0, 20).map(formatTMDBData));
                setTopRatedMovies(topRated.results.slice(0, 20).map(formatTMDBData));

                // Fetch details for top 5 trending to get trailers
                const top5 = trending.results.slice(0, 5);
                const heroDataPromises = top5.map(async (movie) => {
                    try {
                        const details = await getTMDBDetails(movie.id, movie.media_type || 'movie');
                        const trailer = details.videos?.results?.find(
                            v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
                        );
                        return {
                            ...formatTMDBData(movie),
                            trailerKey: trailer?.key
                        };
                    } catch (e) {
                        return formatTMDBData(movie);
                    }
                });

                const heroes = await Promise.all(heroDataPromises);
                setHeroMovies(heroes);

            } catch (err) {
                console.error('Error fetching content:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    // Rotate Hero every 3 minutes
    useEffect(() => {
        if (heroMovies.length === 0) return;

        const interval = setInterval(() => {
            setCurrentHeroIndex((prev) => (prev + 1) % heroMovies.length);
        }, 180000); // 3 minutes

        return () => clearInterval(interval);
    }, [heroMovies]);

    // Handle search with debounce
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setIsSearching(true);
            try {
                const response = await searchTMDB(searchQuery);
                if (response.results) {
                    const formatted = response.results
                        .filter(item => item.media_type !== 'person')
                        .slice(0, 8)
                        .map(formatTMDBData);
                    setSearchResults(formatted);
                }
            } catch (err) {
                console.error('Search error:', err);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 mx-auto mb-4 animate-spin text-[#00ff88]" />
                    <p className="text-gray-400 font-medium tracking-wide">INITIALIZING VESTREAM...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black">
                <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5 py-3">
                    <div className="container mx-auto px-6">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-[#00ff88] rounded-lg flex items-center justify-center">
                                    <Play className="w-4 h-4 text-black fill-current" />
                                </div>
                                <span className="text-2xl font-bold tracking-tight text-white">VeStream</span>
                            </Link>
                        </div>
                    </div>
                </header>
                <div className="pt-20">
                    <ErrorState
                        error={error}
                        onRetry={() => window.location.reload()}
                        title="Failed to load content"
                    />
                </div>
            </div>
        );
    }

    const featuredMovie = heroMovies[currentHeroIndex] || trendingMovies[0];

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-[#00ff88] selection:text-black">

            {/* Cinematic Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/5 py-3' : 'bg-transparent py-6'}`}>
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between gap-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-[#00ff88] rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                                <Play className="w-4 h-4 text-black fill-current" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-white group-hover:text-[#00ff88] transition-colors">
                                VeStream
                            </span>
                        </Link>

                        {/* Navigation */}
                        <Navigation />

                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-xl hidden md:block">
                            <div className={`flex items-center bg-white/5 rounded-full px-5 py-2.5 border transition-all duration-300 ${isSearching ? 'border-[#00ff88] bg-black/50' : 'border-white/10 hover:border-white/20'}`}>
                                <Search className={`w-5 h-5 mr-3 transition-colors ${isSearching ? 'text-[#00ff88]' : 'text-gray-400'}`} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search titles, genres..."
                                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm font-medium"
                                />
                                {isSearching && (
                                    <Loader className="w-4 h-4 text-[#00ff88] animate-spin" />
                                )}
                            </div>

                            {/* Search Results Dropdown */}
                            {searchQuery && searchResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-4 bg-[#0a0a0a] rounded-xl border border-white/10 shadow-2xl max-h-[60vh] overflow-y-auto z-50 animate-fade-in">
                                    <div className="p-2">
                                        {searchResults.map((movie) => (
                                            <Link
                                                key={movie.id}
                                                href={`/watch/${movie.type}/${movie.id}`}
                                                className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors group"
                                            >
                                                <img
                                                    src={movie.poster || 'https://via.placeholder.com/60x90/1a1a2e/00f0ff?text=No+Image'}
                                                    alt={movie.title}
                                                    className="w-12 h-16 object-cover rounded shadow-lg group-hover:scale-105 transition-transform"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-white text-sm font-bold truncate group-hover:text-[#00ff88] transition-colors">{movie.title}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-gray-500">{movie.year}</span>
                                                        <span className="text-xs px-1.5 py-0.5 bg-white/10 rounded text-gray-400 uppercase">{movie.type}</span>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-[#00ff88] transition-colors" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button (Search) */}
                        <Link href="/search" className="md:hidden p-2 -mr-2 text-white hover:text-[#00ff88] transition-colors relative group">
                            <div className="absolute inset-0 bg-[#00ff88]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Search className="w-6 h-6 relative z-10" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main>
                {/* Cinematic Hero */}
                {featuredMovie && (
                    <section className="relative h-[85vh] md:h-[95vh] w-full overflow-hidden">
                        {/* Background Layer */}
                        <div className="absolute inset-0 bg-black">
                            {featuredMovie.trailerKey ? (
                                <div className="relative w-full h-full pointer-events-none select-none">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${featuredMovie.trailerKey}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&rel=0&loop=1&playlist=${featuredMovie.trailerKey}&start=10`}
                                        className="absolute top-1/2 left-1/2 w-[350%] md:w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2 object-cover opacity-50 scale-110 grayscale-[20%] contrast-[1.1]"
                                        allow="autoplay; encrypted-media"
                                    />
                                </div>
                            ) : (
                                <img
                                    src={featuredMovie.backdrop || featuredMovie.poster}
                                    alt={featuredMovie.title}
                                    className="w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom"
                                />
                            )}

                            {/* Cinematic Gradients - Premium Depth */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/40 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#000000]/60 to-transparent" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_100%)] opacity-40" />
                            <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#000000] via-[#000000]/80 to-transparent" />
                        </div>

                        {/* Hero Content */}
                        <div className="relative h-full container mx-auto px-6 flex items-end pb-32 md:pb-40">
                            <div className="max-w-4xl animate-slide-up">
                                <div className="flex items-center gap-3 mb-4 md:mb-6">
                                    <span className="px-3 py-1 bg-[#00ff88] text-black text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-sm shadow-[0_0_15px_rgba(0,255,136,0.4)]">
                                        #{currentHeroIndex + 1} Trending
                                    </span>
                                    <span className="px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 text-white text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-sm">
                                        {featuredMovie.type === 'tv' ? 'TV Series' : 'Movie'}
                                    </span>
                                </div>

                                <h2 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-4 md:mb-8 leading-[1.1] tracking-tight drop-shadow-2xl">
                                    {featuredMovie.title}
                                </h2>

                                <div className="flex items-center gap-6 mb-8 text-sm font-medium text-gray-300">
                                    {featuredMovie.rating && (
                                        <div className="flex items-center gap-2 text-[#00ff88]">
                                            <Star className="w-5 h-5 fill-current" />
                                            <span className="text-white text-lg">{featuredMovie.rating.toFixed(1)}</span>
                                        </div>
                                    )}
                                    <span className="text-white">{featuredMovie.year}</span>
                                    <span className="px-2 py-0.5 border border-white/30 rounded text-xs">HD</span>
                                    <span className="px-2 py-0.5 border border-white/30 rounded text-xs">5.1</span>
                                </div>

                                <p className="text-gray-300 text-lg md:text-xl mb-10 line-clamp-3 max-w-2xl leading-relaxed">
                                    {featuredMovie.description}
                                </p>

                                <div className="flex items-center gap-3 md:gap-4">
                                    <Link
                                        href={`/watch/${featuredMovie.type}/${featuredMovie.id}`}
                                        className="group flex items-center gap-2 md:gap-3 bg-[#00ff88] text-black px-5 py-2.5 md:px-8 md:py-4 rounded-xl font-bold text-sm md:text-lg hover:bg-[#00cc66] transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:shadow-[0_0_40px_rgba(0,255,136,0.5)]"
                                    >
                                        <Play className="w-4 h-4 md:w-6 md:h-6 fill-current group-hover:scale-110 transition-transform" />
                                        Watch Now
                                    </Link>

                                    <button className="flex items-center gap-2 md:gap-3 bg-white/10 backdrop-blur-md text-white px-5 py-2.5 md:px-8 md:py-4 rounded-xl font-bold text-sm md:text-lg border border-white/10 hover:bg-white/20 transition-all hover:scale-105">
                                        <Info className="w-4 h-4 md:w-6 md:h-6" />
                                        More Info
                                    </button>

                                    {featuredMovie.trailerKey && (
                                        <button
                                            onClick={() => setIsMuted(!isMuted)}
                                            className="ml-1 md:ml-4 p-2.5 md:p-4 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-all"
                                        >
                                            {isMuted ? <VolumeX className="w-4 h-4 md:w-6 md:h-6" /> : <Volume2 className="w-4 h-4 md:w-6 md:h-6" />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Continue Watching Section */}
                {continueWatching.length > 0 && !loading && !error && (
                    <section className="py-8 md:py-12 relative z-10">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="flex items-center justify-between mb-6 md:mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-8 bg-[#00ff88] rounded-full shadow-[0_0_15px_rgba(0,255,136,0.5)]" />
                                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                                        Continue Watching
                                    </h2>
                                </div>
                                <Link href="/history" className="group flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-[#00ff88] transition-colors">
                                    View All
                                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>

                            <div className="relative group">
                                <div className="flex gap-4 overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar scroll-smooth">
                                    {continueWatching.map((movie, index) => (
                                        <div key={movie.id} className="flex-none w-[280px] md:w-[320px]" style={{ animationDelay: `${index * 50}ms` }}>
                                            <MovieCard movie={movie} />
                                            {/* Progress Bar Overlay */}
                                            <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,0.5)]"
                                                    style={{ width: `${(movie.progress / movie.duration) * 100}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between mt-1 text-xs text-gray-400">
                                                <span>{Math.floor(movie.progress / 60)}m left</span>
                                                {movie.season && <span>S{movie.season} E{movie.episode}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Scroll Gradients */}
                                <div className="absolute top-0 bottom-8 left-0 w-12 bg-gradient-to-r from-black to-transparent pointer-events-none md:hidden" />
                                <div className="absolute top-0 bottom-8 right-0 w-12 bg-gradient-to-l from-black to-transparent pointer-events-none md:hidden" />
                            </div>
                        </div>
                    </section>
                )}

                {/* Content Sections */}
                <div className="container mx-auto px-6 space-y-16 pb-24 -mt-20 relative z-10">
                    <ContentRow title="Trending Now" icon={Flame} movies={trendingMovies} />
                    <ContentRow title="Popular Movies" icon={TrendingUp} movies={popularMovies} />
                    <ContentRow title="Top Rated" icon={Star} movies={topRatedMovies} />
                </div>
            </main>
        </div>
    );
}

// Cinematic Content Row
function ContentRow({ title, icon: Icon, movies }) {
    return (
        <section>
            <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-8 bg-[#00ff88] rounded-full" />
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{title}</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {movies.map((movie, index) => (
                    <MovieCard key={movie.id} movie={movie} index={index} />
                ))}
            </div>
        </section>
    );
}
