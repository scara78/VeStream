import { useQuery } from '@tanstack/react-query';
import { getTMDBDetails } from '@/services/movieApi';
import { useLibrary } from './useLibrary';

/**
 * Recommendations Hook
 * Provides personalized content recommendations
 */

/**
 * Get similar content based on a specific item
 */
export function useSimilarContent(id, type, options = {}) {
    return useQuery({
        queryKey: ['recommendations', 'similar', type, id],
        queryFn: async () => {
            const details = await getTMDBDetails(id, type);
            return {
                similar: details.similar?.results || [],
                recommended: details.recommendations?.results || [],
            };
        },
        enabled: Boolean(id && type),
        staleTime: 1000 * 60 * 60, // 1 hour
        ...options,
    });
}

/**
 * Get personalized recommendations based on watch history
 */
export function usePersonalizedRecommendations() {
    const { history } = useLibrary();

    return useQuery({
        queryKey: ['recommendations', 'personalized', history.length],
        queryFn: async () => {
            if (history.length === 0) return [];

            // Analyze watch history
            const genreCount = {};
            const recentWatched = history.slice(0, 10);

            // Count genre preferences from history
            recentWatched.forEach(item => {
                if (item.genreIds) {
                    item.genreIds.forEach(genreId => {
                        genreCount[genreId] = (genreCount[genreId] || 0) + 1;
                    });
                }
            });

            // Get recommendations from recently watched items
            const recommendationSets = await Promise.all(
                recentWatched.slice(0, 3).map(async (item) => {
                    try {
                        const details = await getTMDBDetails(item.id, item.type);
                        return details.recommendations?.results || [];
                    } catch {
                        return [];
                    }
                })
            );

            // Flatten and deduplicate
            const allRecommendations = recommendationSets
                .flat()
                .filter((item, index, self) =>
                    index === self.findIndex(i => i.id === item.id)
                )
                .slice(0, 20);

            return {
                recommendations: allRecommendations,
                topGenres: Object.entries(genreCount)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                    .map(([id]) => id),
            };
        },
        enabled: history.length > 0,
        staleTime: 1000 * 60 * 15, // 15 minutes
    });
}

/**
 * Get trending content filtered by user preferences
 */
export function useTrendingForYou() {
    const { history } = useLibrary();

    return useQuery({
        queryKey: ['recommendations', 'trending-for-you', history.length],
        queryFn: async () => {
            // Analyze user's preferred genres from history
            const genreCount = {};
            history.forEach(item => {
                if (item.genreIds) {
                    item.genreIds.forEach(genreId => {
                        genreCount[genreId] = (genreCount[genreId] || 0) + 1;
                    });
                }
            });

            const topGenres = Object.entries(genreCount)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([id]) => Number(id));

            return {
                preferredGenres: topGenres,
                hasPreferences: topGenres.length > 0,
            };
        },
        enabled: history.length > 0,
        staleTime: 1000 * 60 * 30, // 30 minutes
    });
}

export default {
    useSimilarContent,
    usePersonalizedRecommendations,
    useTrendingForYou,
};
