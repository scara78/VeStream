import React, { useState } from 'react';
import { X, Zap, Play, Info, List } from 'lucide-react';
import VideoPlayer from '@/features/player/VideoPlayer';
import EpisodeGrid from '@/features/browse/EpisodeGrid';
import RelatedRail from '@/features/browse/RelatedRail';
import CastRail from '@/features/browse/CastRail';
import { API_CONFIG } from '@/constants/config';

const MediaModal = ({
    movie,
    onClose,
    streamSources,
    loadingStream,
    season,
    episode,
    onSeasonChange,
    onEpisodeChange,
    onNextEpisode,
    onProgressUpdate,
    onAddToWatchlist,
    isInWatchlist,
    onSelectRelated
}) => {
    const [tab, setTab] = useState('overview');

    if (!movie) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container glass-panel animate-slide-up">
                {/* Header */}
                <div className="modal-header">
                    <h3 className="text-gradient">
                        {movie.title || movie.name}
                    </h3>
                    <button onClick={onClose} className="btn-icon">
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-content">
                    {/* PLAYER SECTION */}
                    <div className="player-wrapper">
                        {streamSources.length > 0 ? (
                            <VideoPlayer
                                sources={streamSources}
                                poster={`${API_CONFIG.TMDB_IMG}${movie.backdrop_path}`}
                                uniqueId={`${movie.id}-${season}-${episode}`}
                                onProgressUpdate={(stats) => onProgressUpdate({ ...stats, season, episode })}
                                onNextEpisode={movie.isTv ? onNextEpisode : null}
                            />
                        ) : (
                            <div className="loading-state">
                                <Zap className="animate-spin" size={40} color="var(--accent-primary)" />
                                <p>{loadingStream ? 'CONNECTING TO SOURCE...' : 'INITIALIZING PLAYER...'}</p>
                            </div>
                        )}
                    </div>

                    {/* SIDEBAR SECTION */}
                    <div className="sidebar-wrapper">
                        <div className="tabs-header">
                            <button
                                className={`tab-btn ${tab === 'overview' ? 'active' : ''}`}
                                onClick={() => setTab('overview')}
                            >
                                Overview
                            </button>
                            {movie.isTv && (
                                <button
                                    className={`tab-btn ${tab === 'episodes' ? 'active' : ''}`}
                                    onClick={() => setTab('episodes')}
                                >
                                    Episodes
                                </button>
                            )}
                            <button
                                className={`tab-btn ${tab === 'related' ? 'active' : ''}`}
                                onClick={() => setTab('related')}
                            >
                                Related
                            </button>
                            <button
                                className={`tab-btn ${tab === 'reviews' ? 'active' : ''}`}
                                onClick={() => setTab('reviews')}
                            >
                                Reviews
                            </button>
                        </div>

                        <div className="sidebar-content hide-scrollbar">
                            {tab === 'overview' && (
                                <div className="animate-fade-in">
                                    <div className="meta-row">
                                        <div className="match-score">{Math.round(movie.vote_average * 10)}% Match</div>
                                        <div className="year">{movie.release_date?.split('-')[0]}</div>
                                        <div className="quality-badge">HD</div>
                                    </div>

                                    <p className="overview-text">{movie.overview}</p>

                                    <button
                                        onClick={() => onAddToWatchlist(movie)}
                                        className={`btn-watchlist ${isInWatchlist ? 'in-list' : ''}`}
                                    >
                                        {isInWatchlist ? 'In Library' : '+ Add to Library'}
                                    </button>

                                    <CastRail tmdbId={movie.id} type={movie.title ? 'movie' : 'tv'} />
                                </div>
                            )}
                            {tab === 'episodes' && (
                                <EpisodeGrid
                                    season={season} episode={episode}
                                    onSeasonChange={onSeasonChange}
                                    onEpisodeChange={onEpisodeChange}
                                    loading={loadingStream}
                                />
                            )}
                            {tab === 'related' && (
                                <RelatedRail
                                    movieId={movie.id}
                                    type={movie.title ? 'movie' : 'tv'}
                                    onSelect={onSelectRelated}
                                />
                            )}
                            {tab === 'reviews' && (
                                <ReviewsList type={movie.title ? 'movie' : 'tv'} id={movie.id} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                /* ... existing styles ... */
                .review-item {
                    background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 8px;
                    margin-bottom: 1rem; border: 1px solid var(--border-subtle);
                }
                .review-author { font-weight: 700; color: #fff; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 8px; }
                .review-avatar { width: 24px; height: 24px; border-radius: 50%; background: var(--accent-primary); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; }
                .review-content { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5; max-height: 100px; overflow-y: auto; }
                /* ... */
                .modal-overlay {
                    position: fixed; inset: 0; z-index: 5000;
                    background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
                    display: flex; align-items: center; justify-content: center;
                    padding: 2rem;
                    animation: fadeIn 0.3s ease;
                }
                
                .modal-container {
                    width: 100%; max-width: 1400px; height: 85vh;
                    overflow: hidden; display: flex; flex-direction: column;
                    border-radius: var(--radius-md);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }

                .modal-header {
                    padding: 1rem 1.5rem;
                    border-bottom: 1px solid var(--border-subtle);
                    display: flex; justify-content: space-between; align-items: center;
                    background: rgba(2, 6, 23, 0.8);
                }
                .modal-header h3 { margin: 0; font-size: 1.25rem; font-weight: 700; }

                .btn-icon {
                    background: rgba(255,255,255,0.05); border: none; color: var(--text-secondary);
                    cursor: pointer; border-radius: 50%; padding: 8px; display: flex;
                    transition: all 0.2s;
                }
                .btn-icon:hover { background: rgba(255,255,255,0.1); color: #fff; }

                .modal-content { display: flex; flex: 1; overflow: hidden; }
                .player-wrapper { flex: 1; background: #000; position: relative; display: flex; flex-direction: column; }
                
                .loading-state {
                    height: 100%; display: flex; flex-direction: column; 
                    align-items: center; justify-content: center; gap: 1rem;
                    color: var(--text-muted); font-size: 0.9rem; letter-spacing: 1px;
                }

                .sidebar-wrapper { 
                    width: 400px; background: var(--bg-secondary); 
                    border-left: 1px solid var(--border-subtle); 
                    display: flex; flex-direction: column; 
                }

                .tabs-header {
                    display: flex; border-bottom: 1px solid var(--border-subtle);
                    background: rgba(0,0,0,0.2);
                }
                .tab-btn {
                    flex: 1; padding: 1rem; background: none; border: none;
                    color: var(--text-secondary); font-weight: 600; cursor: pointer;
                    border-bottom: 2px solid transparent; transition: all 0.2s;
                }
                .tab-btn:hover { color: var(--text-primary); }
                .tab-btn.active { color: var(--accent-primary); border-bottom-color: var(--accent-primary); }

                .sidebar-content { flex: 1; overflow-y: auto; padding: 1.5rem; }

                .meta-row { display: flex; align-items: center; gap: 12px; margin-bottom: 1.5rem; }
                .match-score { color: #4ade80; font-weight: 800; }
                .year { color: var(--text-secondary); }
                .quality-badge { 
                    border: 1px solid var(--border-subtle); color: var(--text-muted); 
                    padding: 2px 6px; font-size: 0.7rem; border-radius: 4px; font-weight: 600; 
                }

                .overview-text { 
                    line-height: 1.6; color: var(--text-secondary); 
                    font-size: 0.95rem; margin-bottom: 2rem; 
                }

                .btn-watchlist {
                    width: 100%; padding: 12px; border: none; border-radius: var(--radius-sm);
                    font-weight: 600; cursor: pointer; margin-bottom: 2rem;
                    background: var(--accent-primary); color: white;
                    transition: all 0.2s;
                }
                .btn-watchlist:hover { filter: brightness(1.1); }
                .btn-watchlist.in-list {
                    background: rgba(255,255,255,0.1); color: var(--text-primary);
                }

                @media (max-width: 1024px) {
                    .modal-overlay { padding: 0; align-items: flex-end; }
                    .modal-container { height: 100vh; max-height: 100vh; border-radius: 0; }
                    .modal-content { flex-direction: column; overflow-y: auto; }
                    .player-wrapper { 
                        height: 35vh; min-height: 250px; flex: none; 
                        position: sticky; top: 0; z-index: 50; 
                    }
                    .sidebar-wrapper { width: 100%; height: auto; border-left: none; flex: 1; overflow-y: visible; }
                }
            `}</style>
        </div>


    );
};

const ReviewsList = ({ type, id }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`${API_CONFIG.TMDB_BASE}/${type}/${id}/reviews?api_key=${API_CONFIG.TMDB_KEY}`);
                const data = await res.json();
                setReviews(data.results || []);
            } catch (e) { console.error(e); }
            setLoading(false);
        };
        fetchReviews();
    }, [type, id]);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading reviews...</div>;
    if (reviews.length === 0) return <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No reviews yet.</div>;

    return (
        <div className="animate-fade-in">
            {reviews.map(review => (
                <div key={review.id} className="review-item">
                    <div className="review-author">
                        <div className="review-avatar">{review.author[0].toUpperCase()}</div>
                        {review.author}
                    </div>
                    <p className="review-content">{review.content}</p>
                </div>
            ))}
        </div>
    );
};

export default MediaModal;
