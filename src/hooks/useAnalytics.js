'use client';

import { useLocalStorage } from './useLibrary';

/**
 * Analytics Tracking Hooks
 * Privacy-first analytics stored in localStorage
 */

/**
 * Track page views
 */
export function trackPageView(path) {
    try {
        const analytics = JSON.parse(localStorage.getItem('vestream_analytics') || '{}');
        const pageViews = analytics.pageViews || {};

        pageViews[path] = (pageViews[path] || 0) + 1;
        pageViews._total = (pageViews._total || 0) + 1;
        pageViews._lastView = Date.now();

        localStorage.setItem('vestream_analytics', JSON.stringify({
            ...analytics,
            pageViews,
        }));
    } catch (error) {
        console.error('Analytics tracking error:', error);
    }
}

/**
 * Track video watch events
 */
export function trackWatch(id, type, duration, completed = false) {
    try {
        const analytics = JSON.parse(localStorage.getItem('vestream_analytics') || '{}');
        const watchEvents = analytics.watchEvents || [];

        watchEvents.push({
            id,
            type,
            duration,
            completed,
            timestamp: Date.now(),
        });

        // Keep only last 100 events
        if (watchEvents.length > 100) {
            watchEvents.shift();
        }

        localStorage.setItem('vestream_analytics', JSON.stringify({
            ...analytics,
            watchEvents,
        }));
    } catch (error) {
        console.error('Analytics tracking error:', error);
    }
}

/**
 * Track search queries
 */
export function trackSearch(query, resultsCount) {
    try {
        const analytics = JSON.parse(localStorage.getItem('vestream_analytics') || '{}');
        const searches = analytics.searches || [];

        searches.push({
            query,
            resultsCount,
            timestamp: Date.now(),
        });

        // Keep only last 50 searches
        if (searches.length > 50) {
            searches.shift();
        }

        localStorage.setItem('vestream_analytics', JSON.stringify({
            ...analytics,
            searches,
        }));
    } catch (error) {
        console.error('Analytics tracking error:', error);
    }
}

/**
 * Track errors
 */
export function trackError(type, message) {
    try {
        const analytics = JSON.parse(localStorage.getItem('vestream_analytics') || '{}');
        const errors = analytics.errors || [];

        errors.push({
            type,
            message,
            timestamp: Date.now(),
        });

        // Keep only last 20 errors
        if (errors.length > 20) {
            errors.shift();
        }

        localStorage.setItem('vestream_analytics', JSON.stringify({
            ...analytics,
            errors,
        }));
    } catch (error) {
        console.error('Analytics tracking error:', error);
    }
}

/**
 * Get analytics data
 */
export function useAnalytics() {
    const getAnalytics = () => {
        try {
            const data = JSON.parse(localStorage.getItem('vestream_analytics') || '{}');
            return {
                pageViews: data.pageViews || {},
                watchEvents: data.watchEvents || [],
                searches: data.searches || [],
                errors: data.errors || [],
            };
        } catch {
            return {
                pageViews: {},
                watchEvents: [],
                searches: [],
                errors: [],
            };
        }
    };

    const clearAnalytics = () => {
        localStorage.removeItem('vestream_analytics');
    };

    const exportAnalytics = () => {
        const data = getAnalytics();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vestream-analytics-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return {
        getAnalytics,
        clearAnalytics,
        exportAnalytics,
    };
}

export default {
    trackPageView,
    trackWatch,
    trackSearch,
    trackError,
    useAnalytics,
};
