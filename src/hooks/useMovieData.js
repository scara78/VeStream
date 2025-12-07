import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTMDBTrending,
  getTMDBPopular,
  getTMDBTopRated,
  getTMDBDetails,
  searchTMDB,
  getTMDBDiscover,
  getTMDBGenres
} from '@/services/movieApi';

/**
 * React Query hooks for movie data fetching
 * Provides caching, background refetching, and optimistic updates
 */

// Trending content
export function useTrending(mediaType = 'all', timeWindow = 'week') {
  return useQuery({
    queryKey: ['trending', mediaType, timeWindow],
    queryFn: () => getTMDBTrending(mediaType, timeWindow),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Popular content
export function usePopular(mediaType = 'movie') {
  return useQuery({
    queryKey: ['popular', mediaType],
    queryFn: () => getTMDBPopular(mediaType),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Top rated content
export function useTopRated(mediaType = 'movie') {
  return useQuery({
    queryKey: ['topRated', mediaType],
    queryFn: () => getTMDBTopRated(mediaType),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Movie/TV details
export function useMovieDetails(id, mediaType) {
  return useQuery({
    queryKey: ['movie', id, mediaType],
    queryFn: () => getTMDBDetails(id, mediaType),
    enabled: !!id && !!mediaType,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Search
export function useSearch(query) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchTMDB(query),
    enabled: !!query && query.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Infinite scroll search
export function useInfiniteSearch(query) {
  return useInfiniteQuery({
    queryKey: ['search-infinite', query],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await searchTMDB(query, pageParam);
      return response;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    enabled: !!query && query.length >= 2,
    staleTime: 2 * 60 * 1000,
  });
}

// Discover with filters
export function useDiscover(mediaType, filters = {}) {
  return useQuery({
    queryKey: ['discover', mediaType, filters],
    queryFn: () => getTMDBDiscover(mediaType, filters),
    staleTime: 5 * 60 * 1000,
  });
}

// Infinite scroll discover
export function useInfiniteDiscover(mediaType, filters = {}) {
  return useInfiniteQuery({
    queryKey: ['discover-infinite', mediaType, filters],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getTMDBDiscover(mediaType, { ...filters, page: pageParam });
      return response;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Genres
export function useGenres(mediaType = 'movie') {
  return useQuery({
    queryKey: ['genres', mediaType],
    queryFn: () => getTMDBGenres(mediaType),
    staleTime: 60 * 60 * 1000, // 1 hour (genres don't change often)
  });
}

// Prefetch utility
export function usePrefetchMovie(id, mediaType) {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: ['movie', id, mediaType],
      queryFn: () => getTMDBDetails(id, mediaType),
    });
  };
}

// Optimistic update for likes (local storage)
export function useLikeMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ movieId, liked }) => {
      // Store in localStorage
      const likes = JSON.parse(localStorage.getItem('vestream_likes') || '{}');
      if (liked) {
        likes[movieId] = true;
      } else {
        delete likes[movieId];
      }
      localStorage.setItem('vestream_likes', JSON.stringify(likes));
      return { movieId, liked };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likes'] });
    },
  });
}

// Get liked movies
export function useLikedMovies() {
  return useQuery({
    queryKey: ['likes'],
    queryFn: () => {
      const likes = localStorage.getItem('vestream_likes');
      return likes ? JSON.parse(likes) : {};
    },
  });
}

// Saved movies
export function useSaveMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ movieId, saved }) => {
      const savedMovies = JSON.parse(localStorage.getItem('vestream_saved') || '{}');
      if (saved) {
        savedMovies[movieId] = true;
      } else {
        delete savedMovies[movieId];
      }
      localStorage.setItem('vestream_saved', JSON.stringify(savedMovies));
      return { movieId, saved };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved'] });
    },
  });
}

// Get saved movies
export function useSavedMovies() {
  return useQuery({
    queryKey: ['saved'],
    queryFn: () => {
      const saved = localStorage.getItem('vestream_saved');
      return saved ? JSON.parse(saved) : {};
    },
  });
}

export default {
  useTrending,
  usePopular,
  useTopRated,
  useMovieDetails,
  useSearch,
  useInfiniteSearch,
  useDiscover,
  useInfiniteDiscover,
  useGenres,
  usePrefetchMovie,
  useLikeMovie,
  useLikedMovies,
  useSaveMovie,
  useSavedMovies,
};
