export const API_CONFIG = {
    // TMDB API Configuration
    TMDB_KEY: process.env.NEXT_PUBLIC_TMDB_API_KEY || "",
    TMDB_BASE: process.env.NEXT_PUBLIC_TMDB_BASE_URL || "https://api.themoviedb.org/3",
    TMDB_IMG: process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE || "https://image.tmdb.org/t/p/original",
    TMDB_POSTER: process.env.NEXT_PUBLIC_TMDB_POSTER_BASE || "https://image.tmdb.org/t/p/w500",

    // Gifted Movies API Configuration
    GIFTED_BASE: process.env.NEXT_PUBLIC_GIFTED_API_BASE || "https://movieapi.giftedtech.co.ke/api",
    GIFTED_SEARCH: `${process.env.NEXT_PUBLIC_GIFTED_API_BASE || "https://movieapi.giftedtech.co.ke/api"}/search`,
    GIFTED_INFO: `${process.env.NEXT_PUBLIC_GIFTED_API_BASE || "https://movieapi.giftedtech.co.ke/api"}/info`,
    GIFTED_SOURCES: `${process.env.NEXT_PUBLIC_GIFTED_API_BASE || "https://movieapi.giftedtech.co.ke/api"}/sources`,
    GIFTED_DOWNLOAD: `${process.env.NEXT_PUBLIC_GIFTED_API_BASE || "https://movieapi.giftedtech.co.ke/api"}/download`,
    GIFTED_TRENDING: `${process.env.NEXT_PUBLIC_GIFTED_API_BASE || "https://movieapi.giftedtech.co.ke/api"}/trending`,
    GIFTED_HOMEPAGE: `${process.env.NEXT_PUBLIC_GIFTED_API_BASE || "https://movieapi.giftedtech.co.ke/api"}/homepage`
};

export const THEME = {
    bg: '#020617',         // Deep Slate Black
    surface: '#0f172a',    // Panel Slate
    accent: 'var(--accent-color)',     // Dynamic Accent
    accentGlow: '0 0 20px var(--accent-glow)',
    text: '#f8fafc',
    textDim: '#94a3b8',
    border: 'rgba(255,255,255,0.08)',
    glass: 'rgba(2, 6, 23, 0.85)',
};