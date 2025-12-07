import React, { useState, useEffect } from 'react';
import { Play, Plus, Check } from 'lucide-react';
import { API_CONFIG } from '@/constants/config';
import { getTrendingWithFallback, getTMDBDetails } from '@/services/movieApi';

const HeroSection = ({ onPlay, onToggleWatchlist, watchlist }) => {
    const [movie, setMovie] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [dataSource, setDataSource] = useState('tmdb');

    useEffect(() => {
        const fetchHeroData = async () => {
            try {
                // Use fallback-enabled trending fetch
                const data = await getTrendingWithFallback('all', 'day');
                setDataSource(data.source || 'tmdb');

                const hero = data.results[0];
                setMovie(hero);

                // Fetch Trailer (only for TMDB data with valid id)
                if (data.source !== 'gifted' && hero.id && !hero.gifted_id) {
                    try {
                        const vRes = await fetch(`${API_CONFIG.TMDB_BASE}/${hero.media_type}/${hero.id}/videos?api_key=${API_CONFIG.TMDB_KEY}`);
                        const vData = await vRes.json();
                        const t = vData.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
                        setTrailer(t?.key);
                    } catch (e) {
                        console.warn('Failed to fetch trailer:', e.message);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch hero data:', error);
            }
        };

        fetchHeroData();
    }, []);

    if (!movie) return <div style={{ height: '90vh' }} />;

    const inList = watchlist.find(m => m.id === movie.id);

    return (
        <div className="hero-container">
            {/* BACKGROUND */}
            <div className={`hero-bg ${imageLoaded ? 'loaded' : ''}`}>
                {trailer ? (
                    <iframe
                        src={`https://www.youtube.com/embed/${trailer}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailer}&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1`}
                        className="trailer-iframe"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        title="Hero Trailer"
                        onLoad={() => setImageLoaded(true)}
                    />
                ) : (
                    <img
                        src={movie.gifted_stills || movie.gifted_cover || (movie.backdrop_path ? `${API_CONFIG.TMDB_IMG}${movie.backdrop_path}` : movie.gifted_poster)}
                        onLoad={() => setImageLoaded(true)}
                        alt={movie.title || movie.name}
                        className="hero-image"
                    />
                )}
            </div>

            {/* OVERLAYS */}
            <div className="hero-overlay-bottom" />
            <div className="hero-overlay-left" />

            {/* CONTENT */}
            <div className="hero-content">
                <div className="hero-text-wrapper animate-slide-up">
                    <div className="hero-meta">
                        <span className="trending-badge">#1 TRENDING</span>
                        <span className="release-year">{movie.release_date?.split('-')[0] || '2025'}</span>
                    </div>

                    <h1 className="hero-title">
                        {movie.title || movie.name}
                    </h1>

                    <p className="hero-description">
                        {movie.overview}
                    </p>

                    <div className="hero-actions">
                        <button onClick={() => onPlay(movie)} className="btn-primary hero-btn">
                            <Play fill="currentColor" size={24} />
                            <span>Watch Now</span>
                        </button>

                        <button onClick={() => onToggleWatchlist(movie)} className="glass-button hero-btn">
                            {inList ? <Check size={20} className="text-accent" /> : <Plus size={20} />}
                            <span>My List</span>
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .hero-container {
                    position: relative; height: 100vh; width: 100%; overflow: hidden;
                }
                
                .hero-bg {
                    position: absolute; inset: 0; opacity: 0; transition: opacity 1s ease;
                }
                .hero-bg.loaded { opacity: 1; }

                .trailer-iframe {
                    position: absolute; top: 50%; left: 50%;
                    width: 120vw; height: 120vh;
                    transform: translate(-50%, -50%);
                    pointer-events: none; opacity: 0.6;
                    filter: contrast(1.1) saturate(1.2);
                }

                .hero-image {
                    width: 100%; height: 100%; object-fit: cover;
                    filter: brightness(0.6);
                }

                .hero-overlay-bottom {
                    position: absolute; inset: 0;
                    background: linear-gradient(to top, var(--bg-main) 0%, transparent 60%);
                }
                .hero-overlay-left {
                    position: absolute; inset: 0;
                    background: linear-gradient(to right, var(--bg-main) 0%, transparent 50%);
                }

                .hero-content {
                    position: relative; height: 100%; display: flex; 
                    align-items: center; padding: 0 5%;
                    z-index: 10;
                }

                .hero-text-wrapper {
                    max-width: 800px; margin-top: 100px;
                }

                .hero-meta {
                    display: flex; gap: 12px; margin-bottom: 1.5rem; align-items: center;
                }

                .trending-badge {
                    background: #fff; color: #000; font-weight: 800; 
                    padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; 
                    letter-spacing: 1px;
                }

                .release-year {
                    color: rgba(255,255,255,0.8); font-weight: 600;
                }

                .hero-title {
                    margin-bottom: 1.5rem; font-size: 3.5rem; font-weight: 800;
                    text-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    line-height: 1.1;
                }

                .hero-description {
                    font-size: 1.1rem; color: rgba(255,255,255,0.8); 
                    margin-bottom: 3rem; max-width: 600px; line-height: 1.6;
                    display: -webkit-box; -webkit-line-clamp: 3; 
                    -webkit-box-orient: vertical; overflow: hidden;
                }

                .hero-actions {
                    display: flex; gap: 1.5rem; align-items: center;
                }

                .hero-btn {
                    display: flex; align-items: center; gap: 10px;
                    padding: 14px 32px; font-size: 1.1rem; font-weight: 700;
                    border-radius: var(--radius-sm); cursor: pointer;
                }
                
                .text-accent { color: var(--accent-primary); }

                @media (max-width: 768px) {
                    .hero-title { font-size: 2.5rem; }
                    .hero-description { font-size: 1rem; }
                    .hero-actions { flex-direction: column; align-items: stretch; gap: 1rem; }
                    .hero-btn { justify-content: center; }
                }
            `}</style>
        </div>
    );
};

export default HeroSection;