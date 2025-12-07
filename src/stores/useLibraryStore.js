import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLibraryStore = create(
    persist(
        (set, get) => ({
            watchlist: [],
            history: [],

            addToWatchlist: (movie) => set((state) => {
                if (state.watchlist.find(m => m.id === movie.id)) return state;
                return { watchlist: [movie, ...state.watchlist] };
            }),

            removeFromWatchlist: (id) => set((state) => ({
                watchlist: state.watchlist.filter(m => m.id !== id)
            })),

            toggleWatchlist: (movie) => {
                const { watchlist, addToWatchlist, removeFromWatchlist } = get();
                if (watchlist.find(m => m.id === movie.id)) {
                    removeFromWatchlist(movie.id);
                    return false; // Removed
                } else {
                    addToWatchlist(movie);
                    return true; // Added
                }
            },

            updateHistory: (movie, stats) => set((state) => {
                const filtered = state.history.filter(m => m.id !== movie.id);
                const updated = {
                    ...movie,
                    progress: stats.currentTime,
                    duration: stats.duration,
                    season: stats.season,
                    episode: stats.episode,
                    lastWatched: Date.now()
                };
                return { history: [updated, ...filtered].slice(0, 20) };
            }),

            clearHistory: () => set({ history: [] }),
        }),
        {
            name: 'vestream_library',
        }
    )
);
