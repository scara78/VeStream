import { create } from 'zustand';

export const usePlayerStore = create((set) => ({
    selectedMovie: null,
    streamSources: [],
    loadingStream: false,
    season: 1,
    episode: 1,

    setSelectedMovie: (movie) => set({ selectedMovie: movie, season: 1, episode: 1, streamSources: [] }),
    setStreamSources: (sources) => set({ streamSources: sources }),
    setLoadingStream: (loading) => set({ loadingStream: loading }),
    setSeason: (season) => set({ season, episode: 1 }),
    setEpisode: (episode) => set({ episode }),
    closePlayer: () => set({ selectedMovie: null, streamSources: [] }),
}));
