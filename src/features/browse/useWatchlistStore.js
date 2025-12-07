import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useWatchlistStore = create(
  persist(
    (set, get) => ({
      watchlist: [],
      toggleWatchlist: (movie) => {
        const currentWatchlist = get().watchlist;
        const movieExists = currentWatchlist.some((item) => item.id === movie.id);

        if (movieExists) {
          set({ watchlist: currentWatchlist.filter((item) => item.id !== movie.id) });
        } else {
          set({ watchlist: [...currentWatchlist, movie] });
        }
      },
    }),
    {
      name: 'vestream-watchlist', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);