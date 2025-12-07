import React from 'react';
import Link from 'next/link';
import { Star, Play, Tv, Film, Plus, Check } from 'lucide-react';
import { useLibrary } from '@/hooks/useLibrary';

export default function MovieCard({ movie, index = 0 }) {
    const {
        id,
        title,
        name,
        poster_path,
        poster, // Handle both data structures
        vote_average,
        rating, // Handle both data structures
        release_date,
        first_air_date,
        year, // Handle both data structures
        media_type,
        type, // Handle both data structures
        // Gifted API fields
        gifted_id,
        gifted_cover,
        gifted_poster
    } = movie;

    const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useLibrary();
    const inWatchlist = isInWatchlist(id);

    const handleWatchlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (inWatchlist) {
            removeFromWatchlist(id);
        } else {
            addToWatchlist(movie);
        }
    };

    const displayTitle = title || name;
    // Priority: TMDB poster > Gifted cover > Gifted poster > legacy poster field
    const displayPoster = poster_path
        ? `https://image.tmdb.org/t/p/w500${poster_path}`
        : (gifted_cover || gifted_poster || poster);
    const displayRating = vote_average || rating;
    const displayYear = (release_date || first_air_date)?.split('-')[0] || year;
    const displayType = media_type || type || 'movie';
    // Use gifted_id for navigation if it's from Gifted API
    const displayId = id || gifted_id;

    return (
        <Link
            href={`/watch/${displayType}/${displayId}`}
            className="group relative block w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#050505] ring-1 ring-white/5 hover:ring-[#00ff88]/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(0,255,136,0.2)]"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Poster Image */}
            {displayPoster ? (
                <img
                    src={displayPoster}
                    alt={displayTitle}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-white/5 text-gray-500 font-medium">
                    No Image
                </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-bold text-sm line-clamp-2 mb-2 leading-tight drop-shadow-md">
                        {displayTitle}
                    </h3>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-[#00ff88]">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span className="text-xs font-bold">{displayRating?.toFixed(1)}</span>
                            </div>
                            <span className="text-xs text-gray-300 font-medium">{displayYear}</span>
                        </div>

                        <div className="w-8 h-8 rounded-full bg-[#00ff88] flex items-center justify-center shadow-[0_0_10px_rgba(0,255,136,0.4)] group-hover:scale-110 transition-transform">
                            <Play className="w-4 h-4 text-black fill-current ml-0.5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Type Badge */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 z-10">
                <div className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white/90 flex items-center gap-1">
                    {displayType === 'tv' ? <Tv className="w-3 h-3" /> : <Film className="w-3 h-3" />}
                    {displayType === 'tv' ? 'TV' : 'Movie'}
                </div>
            </div>

            {/* Watchlist Button */}
            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 z-10">
                <button
                    onClick={handleWatchlist}
                    className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 ${inWatchlist
                        ? 'bg-[#00ff88]/20 border-[#00ff88] text-[#00ff88]'
                        : 'bg-black/60 border-white/20 text-white hover:bg-white hover:text-black'
                        }`}
                >
                    {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>
            </div>
        </Link>
    );
}
