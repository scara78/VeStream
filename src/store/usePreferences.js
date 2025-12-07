import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * User Preferences Store
 * Persists user settings, watch history, and preferences
 */

const usePreferencesStore = create(
  persist(
    (set, get) => ({
      // User Settings
      settings: {
        autoplay: true,
        defaultQuality: '720p',
        subtitles: false,
        theme: 'dark',
        language: 'en',
        maturityRating: 'all',
        dataSaver: false,
      },

      // Watch History
      watchHistory: [],

      // Continue Watching
      continueWatching: {},

      // Liked Movies
      likedMovies: {},

      // Saved Movies
      savedMovies: {},

      // Recently Searched
      recentSearches: [],

      // Actions
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      // Watch History
      addToWatchHistory: (item) =>
        set((state) => {
          const history = [
            item,
            ...state.watchHistory.filter((h) => h.id !== item.id),
          ].slice(0, 50); // Keep last 50 items
          return { watchHistory: history };
        }),

      clearWatchHistory: () => set({ watchHistory: [] }),

      // Continue Watching
      updateContinueWatching: (movieId, data) =>
        set((state) => ({
          continueWatching: {
            ...state.continueWatching,
            [movieId]: {
              ...data,
              lastWatched: Date.now(),
            },
          },
        })),

      removeContinueWatching: (movieId) =>
        set((state) => {
          const { [movieId]: removed, ...rest } = state.continueWatching;
          return { continueWatching: rest };
        }),

      getContinueWatching: () => {
        const items = Object.entries(get().continueWatching)
          .map(([id, data]) => ({ id, ...data }))
          .sort((a, b) => b.lastWatched - a.lastWatched)
          .slice(0, 20);
        return items;
      },

      // Likes
      toggleLike: (movieId) =>
        set((state) => {
          const liked = !state.likedMovies[movieId];
          if (liked) {
            return {
              likedMovies: { ...state.likedMovies, [movieId]: true },
            };
          } else {
            const { [movieId]: removed, ...rest } = state.likedMovies;
            return { likedMovies: rest };
          }
        }),

      isLiked: (movieId) => !!get().likedMovies[movieId],

      getLikedMovies: () => Object.keys(get().likedMovies),

      // Saved
      toggleSave: (movieId) =>
        set((state) => {
          const saved = !state.savedMovies[movieId];
          if (saved) {
            return {
              savedMovies: { ...state.savedMovies, [movieId]: true },
            };
          } else {
            const { [movieId]: removed, ...rest } = state.savedMovies;
            return { savedMovies: rest };
          }
        }),

      isSaved: (movieId) => !!get().savedMovies[movieId],

      getSavedMovies: () => Object.keys(get().savedMovies),

      // Recent Searches
      addRecentSearch: (query) =>
        set((state) => {
          const searches = [
            query,
            ...state.recentSearches.filter((s) => s !== query),
          ].slice(0, 10); // Keep last 10 searches
          return { recentSearches: searches };
        }),

      clearRecentSearches: () => set({ recentSearches: [] }),

      // Reset all
      resetPreferences: () =>
        set({
          settings: {
            autoplay: true,
            defaultQuality: '720p',
            subtitles: false,
            theme: 'dark',
            language: 'en',
            maturityRating: 'all',
            dataSaver: false,
          },
          watchHistory: [],
          continueWatching: {},
          likedMovies: {},
          savedMovies: {},
          recentSearches: [],
        }),
    }),
    {
      name: 'vestream-preferences',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        settings: state.settings,
        watchHistory: state.watchHistory,
        continueWatching: state.continueWatching,
        likedMovies: state.likedMovies,
        savedMovies: state.savedMovies,
        recentSearches: state.recentSearches,
      }),
    }
  )
);

export default usePreferencesStore;
