'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Player from '@/components/Player';
import { Eye, ThumbsUp, Share2, Bookmark, Clock, Calendar, Zap, Star, Loader, Film, Tv, Play, Youtube, ChevronLeft, ChevronRight, Info, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import MovieCard from '@/components/MovieCard';
import { WatchPageSkeleton } from '@/components/Skeletons';
import { useLibrary } from '@/hooks/useLibrary';
import { LoadingProgress } from '@/components/LoadingComponents';
import { searchMovies, getMovieInfo, getDownloadSources, isTVShow, findBestMatch, getTMDBDetails } from '@/services/movieApi';
import { useSimilarContent } from '@/hooks/useRecommendations';
import usePreferencesStore from '@/store/usePreferences';
import { useColorExtraction, parseGiftedColor } from '@/hooks/useColorExtraction';

export default function WatchClient({ initialData }) {
    const router = useRouter();
    const { tmdbData: initialTmdbData, tmdbId, mediaType, season, episode } = initialData;
    const { isLiked, isSaved, toggleLike, toggleSave } = usePreferencesStore();

    // Create unique ID for likes/saves (format: "type_id")
    const contentId = `${mediaType}_${tmdbId}`;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [movieData, setMovieData] = useState(null);
    const [tmdbData, setTmdbData] = useState(initialTmdbData);
    const [videoSources, setVideoSources] = useState([]);
    const [selectedQuality, setSelectedQuality] = useState('720p');
    const [showQualityMenu, setShowQualityMenu] = useState(false);
    const [showTrailer, setShowTrailer] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState(season ? parseInt(season) : 1);
    const [selectedEpisode, setSelectedEpisode] = useState(episode ? parseInt(episode) : 1);
    const [expandedSeason, setExpandedSeason] = useState(season ? parseInt(season) : null);
    const [initialTime, setInitialTime] = useState(0);
    const initializedRef = useRef(null);

    // Library Hooks
    const { addToWatchlist, removeFromWatchlist, isInWatchlist, addToHistory, getProgress } = useLibrary();
    const inWatchlist = isInWatchlist(contentId);

    // Auto-add to history when data is loaded and get saved progress
    useEffect(() => {
        if (tmdbData && movieData && initializedRef.current !== tmdbData.id) {
            initializedRef.current = tmdbData.id;

            // Get saved progress
            const savedProgress = getProgress(tmdbData.id);
            if (savedProgress > 0) {
                setInitialTime(savedProgress);
            }

            addToHistory({
                id: tmdbData.id,
                title: tmdbData.title || tmdbData.name,
                poster_path: tmdbData.poster_path,
                vote_average: tmdbData.vote_average,
                release_date: tmdbData.release_date,
                first_air_date: tmdbData.first_air_date,
                media_type: mediaType,
                progress: savedProgress, // Preserve existing progress on load
                season: selectedSeason,
                episode: selectedEpisode
            });
        }
    }, [tmdbData, mediaType, movieData, addToHistory, getProgress, selectedSeason, selectedEpisode]);

    const handleProgress = useCallback((state) => {
        if (tmdbData) {
            addToHistory({
                id: tmdbData.id,
                title: tmdbData.title || tmdbData.name,
                poster_path: tmdbData.poster_path,
                vote_average: tmdbData.vote_average,
                release_date: tmdbData.release_date,
                first_air_date: tmdbData.first_air_date,
                media_type: mediaType,
                progress: state.currentTime,
                duration: state.duration,
                season: selectedSeason,
                episode: selectedEpisode
            });
        }
    }, [tmdbData, mediaType, selectedSeason, selectedEpisode, addToHistory]);

    const handleWatchlist = () => {
        if (inWatchlist) {
            removeFromWatchlist(contentId);
        } else {
            addToWatchlist({
                id: tmdbData.id,
                title: tmdbData.title || tmdbData.name,
                poster_path: tmdbData.poster_path,
                vote_average: tmdbData.vote_average,
                release_date: tmdbData.release_date,
                first_air_date: tmdbData.first_air_date,
                media_type: mediaType
            });
        }
    };

    // Fetch TMDB data if not provided by server
    useEffect(() => {
        if (!initialTmdbData && tmdbId && mediaType) {
            const fetchTMDB = async () => {
                try {
                    console.log('Fetching TMDB data on client...');
                    const details = await getTMDBDetails(tmdbId, mediaType);
                    setTmdbData(details);
                } catch (err) {
                    console.error('Failed to fetch TMDB data:', err);
                    setError('Failed to load content information.');
                }
            };
            fetchTMDB();
        }
    }, [initialTmdbData, tmdbId, mediaType]);

    // Fetch similar content recommendations
    const { data: similarData } = useSimilarContent(tmdbId, mediaType);

    // Extract dynamic accent color from poster/backdrop
    const posterUrl = tmdbData?.poster_path
        ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
        : null;
    const fallbackColor = movieData?.subject?.cover?.avgHueLight
        ? parseGiftedColor(movieData.subject.cover.avgHueLight)
        : null;
    const { colors: accentColors } = useColorExtraction(posterUrl, fallbackColor);

    // Fetch movie data and sources
    useEffect(() => {
        const fetchData = async () => {
            if (!tmdbId || !mediaType || !tmdbData) return;

            setLoading(true);
            setError(null);

            try {
                const movieTitle = tmdbData.title || tmdbData.name;
                console.log(`Searching Gifted API for: ${movieTitle}`);

                // Search Gifted API by title
                const giftedSearch = await searchMovies(movieTitle);
                console.log('Gifted Search Result:', giftedSearch);

                if (!giftedSearch.results?.items || giftedSearch.results.items.length === 0) {
                    console.error('Gifted API search returned no results');
                    setError(`No streaming sources found for "${movieTitle}".`);
                    setLoading(false);
                    return;
                }

                // Find Best Match
                const giftedMovie = findBestMatch(giftedSearch.results.items, movieTitle, mediaType);

                if (!giftedMovie) {
                    console.error('No valid match found for type:', mediaType);
                    setError(`No matching ${mediaType === 'tv' ? 'TV Series' : 'Movie'} found for "${movieTitle}".`);
                    setLoading(false);
                    return;
                }

                const giftedId = giftedMovie.subjectId;
                console.log(`Found Best Match Gifted ID: ${giftedId} (${giftedMovie.title})`);

                // Get detailed info from Gifted API
                const info = await getMovieInfo(giftedId);
                console.log('Gifted Info:', info);

                if (info.status === 200 && info.success) {
                    setMovieData(info.results);

                    // Fetch download sources
                    const currentSeason = mediaType === 'tv' ? (season ? parseInt(season) : 1) : null;
                    const currentEpisode = mediaType === 'tv' ? (episode ? parseInt(episode) : 1) : null;

                    const sources = await getDownloadSources(
                        giftedId,
                        currentSeason,
                        currentEpisode
                    );
                    console.log(`Download Sources (S${currentSeason} E${currentEpisode}):`, sources);

                    if (sources.status === 200 && sources.success) {
                        setVideoSources(sources.results);
                        // Auto-select highest quality or 720p by default
                        const qualities = sources.results.map(s => s.quality);
                        if (qualities.includes('720p')) setSelectedQuality('720p');
                        else if (qualities.includes('480p')) setSelectedQuality('480p');
                        else if (qualities.length > 0) setSelectedQuality(qualities[0]);
                    } else {
                        setError('No video sources available for this title.');
                    }
                } else {
                    setError('Failed to load movie details.');
                }
            } catch (err) {
                console.error('Error fetching movie data:', err);
                setError('Failed to load movie data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [tmdbId, mediaType, season, episode, tmdbData]);

    // Format duration helper
    const formatDuration = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
    };

    // Loading state
    if (loading) {
        return (
            <>
                <LoadingProgress isLoading={loading} />
                <WatchPageSkeleton />
            </>
        );
    }

    // Error state
    if (error || !movieData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center p-8 bg-white/5 rounded-2xl border border-white/10 max-w-md mx-4">
                    <Zap className="w-16 h-16 text-[#00ff88] mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Stream Unavailable</h2>
                    <p className="text-gray-400 mb-6">{error || 'Movie not found'}</p>
                    <Button onClick={() => router.back()} className="btn-jungle w-full">
                        Return Home
                    </Button>
                </div>
            </div>
        );
    }

    const { subject, stars, resource } = movieData;
    const currentVideo = videoSources.find(s => s.quality === selectedQuality);
    const genres = subject.genre?.split(',') || [];

    // Episode navigation helpers
    const currentSeasonData = resource?.seasons?.find(s => s.se === selectedSeason);
    const maxEpisodes = currentSeasonData?.maxEp || 0;
    const hasPrevEpisode = selectedEpisode > 1;
    const hasNextEpisode = selectedEpisode < maxEpisodes;

    const goToPrevEpisode = () => {
        if (hasPrevEpisode) {
            router.push(`/watch/${mediaType}/${tmdbId}?season=${selectedSeason}&episode=${selectedEpisode - 1}`);
        }
    };

    const goToNextEpisode = () => {
        if (hasNextEpisode) {
            router.push(`/watch/${mediaType}/${tmdbId}?season=${selectedSeason}&episode=${selectedEpisode + 1}`);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-[#00ff88] selection:text-black pb-24">

            {/* Top Navigation Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent pt-4 pb-12 pointer-events-none">
                <div className="container mx-auto px-6 pointer-events-auto">
                    <Button
                        onClick={() => router.push('/')}
                        variant="ghost"
                        className="text-white/80 hover:text-white hover:bg-white/10 gap-2"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back to Browse
                    </Button>
                </div>
            </div>

            {/* Cinematic Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30 z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent z-10" />
                {tmdbData?.backdrop_path && (
                    <img
                        src={`https://image.tmdb.org/t/p/original${tmdbData.backdrop_path}`}
                        alt="Background"
                        className="w-full h-full object-cover opacity-50 animate-fade-in scale-105"
                    />
                )}
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 container mx-auto px-4 pt-32 md:pt-40">
                <div className="max-w-[1600px] mx-auto">

                    {/* Title & Meta Header */}
                    <div className="mb-12 animate-fade-in">
                        <Badge variant="jungle" className="mb-4">
                            {mediaType === 'tv' ? 'TV Series' : 'Movie'}
                        </Badge>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl max-w-4xl leading-[1.1]">
                            {subject.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-300 font-medium">
                            {subject.imdbRatingValue && (
                                <div className="flex items-center gap-1.5 text-[#00ff88] font-bold bg-[#00ff88]/10 backdrop-blur-md border border-[#00ff88]/20 px-3 py-1.5 rounded-lg">
                                    <Star className="w-4 h-4 fill-current" />
                                    {subject.imdbRatingValue}
                                </div>
                            )}
                            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {subject.year}
                            </span>
                            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                                <Clock className="w-4 h-4 text-gray-400" />
                                {formatDuration(subject.duration)}
                            </span>
                            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                                <Film className="w-4 h-4 text-gray-400" />
                                {subject.countryName}
                            </span>
                            <span className="px-2 py-0.5 border border-white/20 rounded text-xs font-bold text-white bg-white/5 backdrop-blur-sm">HD</span>
                        </div>
                    </div>

                    {/* Player Section with Cinema Mode Glow - Dynamic Color */}
                    <div className="relative mb-12 group">
                        {/* Cinema Mode Glow - Dynamic */}
                        <div
                            className="absolute -inset-1 rounded-2xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-1000"
                            style={{
                                background: `linear-gradient(to right, ${accentColors.subtle}, ${accentColors.muted}20, ${accentColors.subtle})`
                            }}
                        />

                        <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/5">
                            {currentVideo ? (
                                <Player
                                    src={currentVideo.download_url}
                                    accentColor={accentColors}
                                    onProgressUpdate={handleProgress}
                                    initialTime={initialTime}
                                    videoSources={videoSources}
                                    selectedQuality={selectedQuality}
                                    onQualityChange={setSelectedQuality}
                                    onVideoEnd={mediaType === 'tv' ? goToNextEpisode : null}
                                    hasNextEpisode={mediaType === 'tv' && hasNextEpisode}
                                />
                            ) : (
                                <div className="aspect-video bg-[#050505] flex flex-col items-center justify-center">
                                    <Zap className="w-16 h-16 text-gray-700 mb-4" />
                                    <p className="text-gray-500 font-medium">Select a source to begin playback</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Controls & Info Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* Left Column: Controls & Description */}
                        <div className="lg:col-span-2 space-y-10">

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl">
                                <Button
                                    onClick={() => toggleLike(contentId)}
                                    variant="ghost"
                                    className="flex-1 gap-2 rounded-xl border border-white/5"
                                    style={isLiked(contentId) ? {
                                        color: accentColors.primary,
                                        backgroundColor: accentColors.subtle,
                                        borderColor: `${accentColors.primary}33`
                                    } : { color: '#9ca3af', backgroundColor: 'rgba(255,255,255,0.05)' }}
                                >
                                    <ThumbsUp className="w-5 h-5" fill={isLiked(contentId) ? 'currentColor' : 'none'} />
                                    <span className="text-xs md:text-sm font-medium">Like</span>
                                </Button>
                                <Button
                                    onClick={handleWatchlist}
                                    className="flex-1 gap-2 rounded-xl border transition-all duration-300"
                                    style={inWatchlist ? {
                                        color: accentColors.primary,
                                        backgroundColor: accentColors.subtle,
                                        borderColor: `${accentColors.primary}33`
                                    } : { color: '#9ca3af', backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.05)' }}
                                >
                                    {inWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                    <span className="text-xs md:text-sm font-medium">{inWatchlist ? 'In Watchlist' : 'Add to List'}</span>
                                </Button>
                                <Button variant="ghost" className="flex-1 text-gray-400 hover:text-white gap-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5">
                                    <Share2 className="w-5 h-5" />
                                    <span className="text-xs md:text-sm font-medium">Share</span>
                                </Button>
                            </div>

                            {/* Episode Navigation (TV Only) */}
                            {mediaType === 'tv' && selectedSeason && selectedEpisode && (
                                <div className="flex items-center justify-between bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl">
                                    <Button
                                        onClick={goToPrevEpisode}
                                        disabled={!hasPrevEpisode}
                                        variant="ghost"
                                        className={`gap-2 hover:bg-white/10 rounded-xl ${!hasPrevEpisode && 'opacity-50'}`}
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                        <div className="text-left hidden sm:block">
                                            <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Previous</div>
                                            <div className="font-bold">Episode {selectedEpisode - 1}</div>
                                        </div>
                                    </Button>

                                    <div className="text-center">
                                        <h3 className="text-2xl font-black text-white tracking-tight">S{selectedSeason} E{selectedEpisode}</h3>
                                        <p className="text-sm text-[#00ff88] font-medium">Now Playing</p>
                                    </div>

                                    <Button
                                        onClick={goToNextEpisode}
                                        disabled={!hasNextEpisode}
                                        variant="ghost"
                                        className={`gap-2 hover:bg-white/10 rounded-xl ${!hasNextEpisode && 'opacity-50'}`}
                                    >
                                        <div className="text-right hidden sm:block">
                                            <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Next</div>
                                            <div className="font-bold">Episode {selectedEpisode + 1}</div>
                                        </div>
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </div>
                            )}

                            {/* Synopsis */}
                            <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-8 border border-white/5">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Info className="w-5 h-5 text-[#00ff88]" />
                                    Synopsis
                                </h3>
                                <p className="text-gray-300 leading-relaxed text-lg font-light">
                                    {subject.description || 'No description available.'}
                                </p>

                                {/* Genres */}
                                <div className="flex flex-wrap gap-2 mt-8">
                                    {genres.map((genre, index) => (
                                        <span
                                            key={index}
                                            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-gray-300 hover:border-[#00ff88]/50 hover:text-[#00ff88] hover:bg-[#00ff88]/5 transition-all cursor-default"
                                        >
                                            {genre.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Cast Grid */}
                            {stars && stars.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <Star className="w-5 h-5 text-[#00ff88]" />
                                        Top Cast
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {stars.slice(0, 8).map((star, index) => (
                                            <div key={`${star.staffId}-${index}`} className="group flex items-center gap-4 bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/5 hover:border-[#00ff88]/30 hover:bg-white/5 transition-all duration-300">
                                                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/10 group-hover:border-[#00ff88]/50 transition-colors">
                                                    <img
                                                        src={star.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${star.name}`}
                                                        alt={star.name}
                                                        className="w-full h-full object-cover bg-black"
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-white truncate group-hover:text-[#00ff88] transition-colors">{star.name}</p>
                                                    <p className="text-xs text-gray-500 truncate">{star.character}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Sidebar */}
                        <div className="space-y-8">

                            {/* Seasons List (TV Only) */}
                            {mediaType === 'tv' && resource?.seasons && resource.seasons.length > 0 && (
                                <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-xl">
                                    <div className="p-5 border-b border-white/10 bg-white/5 backdrop-blur-md">
                                        <h3 className="font-bold text-white flex items-center gap-2">
                                            <Tv className="w-5 h-5 text-[#00ff88]" />
                                            Seasons & Episodes
                                        </h3>
                                    </div>
                                    <div className="max-h-[500px] overflow-y-auto custom-scrollbar p-2">
                                        {resource.seasons.map((seasonData) => {
                                            const isExpanded = expandedSeason === seasonData.se;
                                            const isCurrentSeason = selectedSeason === seasonData.se;

                                            return (
                                                <div key={seasonData.se} className="mb-2 last:mb-0">
                                                    <button
                                                        onClick={() => setExpandedSeason(isExpanded ? null : seasonData.se)}
                                                        className={`w-full p-4 flex items-center justify-between rounded-xl transition-all ${isCurrentSeason ? 'bg-[#00ff88]/10 border border-[#00ff88]/20' : 'hover:bg-white/5 border border-transparent'}`}
                                                    >
                                                        <span className={`font-bold ${isCurrentSeason ? 'text-[#00ff88]' : 'text-gray-300'}`}>
                                                            Season {seasonData.se}
                                                        </span>
                                                        <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                                                    </button>

                                                    {isExpanded && seasonData.maxEp && (
                                                        <div className="p-3 bg-black/40 grid grid-cols-5 gap-2">
                                                            {Array.from({ length: seasonData.maxEp }, (_, i) => i + 1).map((ep) => {
                                                                const isCurrent = selectedSeason === seasonData.se && selectedEpisode === ep;
                                                                return (
                                                                    <Link
                                                                        key={ep}
                                                                        href={`/watch/${mediaType}/${tmdbId}?season=${seasonData.se}&episode=${ep}`}
                                                                        onClick={() => {
                                                                            setSelectedSeason(seasonData.se);
                                                                            setSelectedEpisode(ep);
                                                                        }}
                                                                        className={`aspect-square rounded flex items-center justify-center text-sm font-bold transition-all ${isCurrent
                                                                            ? 'bg-[#00ff88] text-black'
                                                                            : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                                                                            }`}
                                                                    >
                                                                        {ep}
                                                                    </Link>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* More Like This Section */}
                    {(similarData?.similar?.length > 0 || similarData?.recommended?.length > 0) && (
                        <div className="mt-20 border-t border-white/10 pt-12">
                            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                                <span className="bg-[#00ff88]/10 p-2 rounded-lg">
                                    <Zap className="w-6 h-6 text-[#00ff88]" />
                                </span>
                                More Like This
                            </h2>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                                {(similarData.similar || similarData.recommended)
                                    ?.slice(0, 12)
                                    .map((item, index) => (
                                        <MovieCard
                                            key={item.id}
                                            movie={{ ...item, type: item.media_type || mediaType }}
                                            index={index}
                                        />
                                    ))}
                            </div>
                        </div>
                    )}


                </div >
            </div >
        </div >
    );
}
