'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/Toast';

export function useLibrary() {
    const [watchlist, setWatchlist] = useState([]);
    const [history, setHistory] = useState([]);
    const { addToast } = useToast();

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const savedWatchlist = JSON.parse(localStorage.getItem('vestream_watchlist') || '[]');
            const savedHistory = JSON.parse(localStorage.getItem('vestream_history') || '[]');
            setWatchlist(savedWatchlist);
            setHistory(savedHistory);
        } catch (error) {
            console.error('Failed to load library:', error);
        }
    }, []);

    const addToWatchlist = useCallback((movie) => {
        setWatchlist((prev) => {
            if (prev.some((item) => item.id === movie.id)) {
                addToast({
                    title: 'Already in Watchlist',
                    description: `${movie.title || movie.name} is already in your list.`,
                    type: 'info'
                });
                return prev;
            }

            const updated = [movie, ...prev];
            localStorage.setItem('vestream_watchlist', JSON.stringify(updated));
            addToast({
                title: 'Added to Watchlist',
                description: `${movie.title || movie.name} has been added to your list.`,
                type: 'success'
            });
            return updated;
        });
    }, [addToast]);

    const removeFromWatchlist = useCallback((movieId) => {
        setWatchlist((prev) => {
            const updated = prev.filter((item) => item.id !== movieId);
            localStorage.setItem('vestream_watchlist', JSON.stringify(updated));
            addToast({
                title: 'Removed from Watchlist',
                type: 'info'
            });
            return updated;
        });
    }, [addToast]);

    const addToHistory = useCallback((movie) => {
        setHistory((prev) => {
            // Remove if already exists (to move to top)
            const filtered = prev.filter((item) => item.id !== movie.id);

            // Create new history item with progress
            const historyItem = {
                ...movie,
                lastWatched: Date.now(),
                progress: movie.progress || 0,
                duration: movie.duration || 0,
                season: movie.season || null,
                episode: movie.episode || null
            };

            const updated = [historyItem, ...filtered].slice(0, 50); // Keep last 50 items
            localStorage.setItem('vestream_history', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const getProgress = useCallback((movieId) => {
        const item = history.find((i) => i.id === movieId);
        return item ? item.progress : 0;
    }, [history]);

    const clearHistory = useCallback(() => {
        setHistory([]);
        localStorage.removeItem('vestream_history');
        addToast({
            title: 'History Cleared',
            type: 'success'
        });
    }, [addToast]);

    const isInWatchlist = useCallback((movieId) => {
        return watchlist.some((item) => item.id === movieId);
    }, [watchlist]);

    return {
        watchlist,
        history,
        addToWatchlist,
        removeFromWatchlist,
        addToHistory,
        clearHistory,
        isInWatchlist,
        getProgress
    };
}
