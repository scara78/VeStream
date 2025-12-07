import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useHistoryStore = create(
  persist(
    (set, get) => ({
      history: [],
      updateHistory: (movie, stats) => {
        const currentHistory = get().history;
        const existingIndex = currentHistory.findIndex((item) => item.id === movie.id && item.media_type === movie.media_type);

        const updatedMovie = {
          id: movie.id,
          media_type: movie.media_type,
          title: movie.title || movie.name,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          progress: stats.currentTime,
          duration: stats.duration,
          lastWatched: Date.now(),
          // Add season/episode if applicable (for TV shows)
          season: stats.season,
          episode: stats.episode,
        };

        let newHistory;
        if (existingIndex > -1) {
          newHistory = [updatedMovie, ...currentHistory.filter((_, idx) => idx !== existingIndex)];
        } else {
          newHistory = [updatedMovie, ...currentHistory];
        }
        set({ history: newHistory.slice(0, 50) }); // Keep history to a reasonable size
      },
      removeHistoryItem: (id, media_type) => set((state) => ({
        history: state.history.filter((item) => !(item.id === id && item.media_type === media_type)),
      })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'vestream-watch-history',
      storage: createJSONStorage(() => localStorage),
    }
  )
);