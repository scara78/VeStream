import { useQuery } from '@tanstack/react-query';
import {
    getTMDBTrending,
    getTMDBPopular,
    getTMDBTopRated,
    getTMDBDetails,
    searchTMDB,
    getTMDBSeason,
    getTMDBDiscover,
    getTMDBGenres
} from '@/services/movieApi';

/**
 * React Query Hooks for TMDB API
 * Provides automatic caching, background refetching, and error handling
 */

// Query keys for cache management
export const tmdbKeys = {
    all: ['tmdb'],
    trending: (mediaType, timeWindow) => ['tmdb', 'trending', mediaType, timeWindow],
    popular: (type) => ['tmdb', 'popular', type],
    topRated: (type) => ['tmdb', 'topRated', type],
    details: (id, type) => ['tmdb', 'details', type, id],
    search: (query) => ['tmdb', 'search', query],
    season: (tvId, seasonNumber) => ['tmdb', 'season', tvId, seasonNumber],
    discover: (type, params) => ['tmdb', 'discover', type, params],
    genres: (type) => ['tmdb', 'genres', type],
};

/**
 * Fetch trending content
 * Cached for 30 minutes to reduce API calls
 */
export function useTMDBTrending(mediaType = 'all', timeWindow = 'week') {
    return useQuery({
        queryKey: tmdbKeys.trending(mediaType, timeWindow),
        queryFn: () => getTMDBTrending(mediaType, timeWindow),
        staleTime: 1000 * 60 * 30, // 30 minutes
    });
}

/**
 * Fetch popular content
 */
export function useTMDBPopular(type = 'movie') {
    return useQuery({
        queryKey: tmdbKeys.popular(type),
        queryFn: () => getTMDBPopular(type),
        staleTime: 1000 * 60 * 30,
    });
}

/**
 * Fetch top rated content
 */
export function useTMDBTopRated(type = 'movie') {
    return useQuery({
        queryKey: tmdbKeys.topRated(type),
        queryFn: () => getTMDBTopRated(type),
        staleTime: 1000 * 60 * 30,
    });
}

/**
 * Fetch movie/TV details
 * Critical data - longer cache time
 */
export function useTMDBDetails(id, type = 'movie', options = {}) {
    return useQuery({
        queryKey: tmdbKeys.details(id, type),
        queryFn: () => getTMDBDetails(id, type),
        enabled: Boolean(id), // Only run if ID is provided
        staleTime: 1000 * 60 * 60, // 1 hour
        ...options,
    });
}

/**
 * Search TMDB
 * Shorter cache since results change frequently
 */
export function useTMDBSearch(query) {
    return useQuery({
        queryKey: tmdbKeys.search(query),
        queryFn: () => searchTMDB(query),
        enabled: query.length > 0, // Search if query is present
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

/**
 * Fetch TV season details
 */
export function useTMDBSeason(tvId, seasonNumber, options = {}) {
    return useQuery({
        queryKey: tmdbKeys.season(tvId, seasonNumber),
        queryFn: () => getTMDBSeason(tvId, seasonNumber),
        enabled: Boolean(tvId && seasonNumber),
        staleTime: 1000 * 60 * 60, // 1 hour
        ...options,
    });
}

/**
 * Discover content with filters
 */
export function useTMDBDiscover(type, params) {
    return useQuery({
        queryKey: tmdbKeys.discover(type, params),
        queryFn: () => getTMDBDiscover(type, params),
        staleTime: 1000 * 60 * 30, // 30 minutes
    });
}

/**
 * Fetch genres
 */
export function useTMDBGenres(type) {
    return useQuery({
        queryKey: tmdbKeys.genres(type),
        queryFn: () => getTMDBGenres(type),
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
}
