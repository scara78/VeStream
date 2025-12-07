import { API_CONFIG } from '@/constants/config';

/**
 * Enhanced Movie API Service
 * Integrates both Gifted Movies API and TMDB API for comprehensive data
 */

// ========================================
// Utility Functions
// ========================================

/**
 * Fetch with timeout and retry logic for TMDB
 */
const fetchWithTimeout = async (url, timeout = 15000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);

    // Only log in development to reduce console noise
    if (process.env.NODE_ENV === 'development') {
      console.error(`Fetch failed for URL: ${url}`, error);
    }

    if (error.name === 'AbortError') {
      throw new Error(`TMDB fetch timeout`);
    }
    throw error;
  }
};

/**
 * Retry wrapper for TMDB API calls
 */
const withRetry = async (fn, maxRetries = 2, initialDelay = 1000) => {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        throw error;
      }

      const delay = initialDelay * Math.pow(2, attempt);
      if (process.env.NODE_ENV === 'development') {
        console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms...`);
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

// ========================================
// TMDB API Functions
// ========================================

/**
 * Get TMDB trending content
 * @param {string} mediaType - 'all', 'movie', or 'tv'
 * @param {string} timeWindow - 'day' or 'week'
 */
export const getTMDBTrending = async (mediaType = 'all', timeWindow = 'week') => {
  return withRetry(async () => {
    const response = await fetchWithTimeout(
      `${API_CONFIG.TMDB_BASE}/trending/${mediaType}/${timeWindow}?api_key=${API_CONFIG.TMDB_KEY}`
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    return await response.json();
  });
};

/**
 * Get TMDB movie/TV details with additional data
 * @param {number} id - TMDB ID
 * @param {string} type - 'movie' or 'tv'
 */
export const getTMDBDetails = async (id, type = 'movie') => {
  return withRetry(async () => {
    const response = await fetchWithTimeout(
      `${API_CONFIG.TMDB_BASE}/${type}/${id}?api_key=${API_CONFIG.TMDB_KEY}&append_to_response=videos,credits,similar,recommendations,images,keywords,reviews,external_ids`
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    return await response.json();
  });
};

/**
 * Search TMDB multi (movies, TV shows, people)
 * @param {string} query - Search query
 */
export const searchTMDB = async (query) => {
  return withRetry(async () => {
    const response = await fetchWithTimeout(
      `${API_CONFIG.TMDB_BASE}/search/multi?api_key=${API_CONFIG.TMDB_KEY}&query=${encodeURIComponent(query)}&page=1`
    );

    if (!response.ok) {
      throw new Error(`TMDB search error: ${response.status}`);
    }

    return await response.json();
  });
};

/**
 * Get TMDB discover (filter by genre, year, etc.)
 * @param {string} type - 'movie' or 'tv'
 * @param {Object} params - Filter parameters
 */
export const getTMDBDiscover = async (type = 'movie', params = {}) => {
  return withRetry(async () => {
    const queryParams = new URLSearchParams({
      api_key: API_CONFIG.TMDB_KEY,
      sort_by: 'popularity.desc',
      page: 1,
      ...params
    });

    const response = await fetchWithTimeout(
      `${API_CONFIG.TMDB_BASE}/discover/${type}?${queryParams}`
    );

    if (!response.ok) {
      throw new Error(`TMDB discover error: ${response.status}`);
    }

    return await response.json();
  });
};

/**
 * Get TMDB genres
 * @param {string} type - 'movie' or 'tv'
 */
export const getTMDBGenres = async (type = 'movie') => {
  return withRetry(async () => {
    const response = await fetchWithTimeout(
      `${API_CONFIG.TMDB_BASE}/genre/${type}/list?api_key=${API_CONFIG.TMDB_KEY}`
    );

    if (!response.ok) {
      throw new Error(`TMDB genres error: ${response.status}`);
    }

    return await response.json();
  });
};

/**
 * Get TMDB popular content
 * @param {string} type - 'movie' or 'tv'
 * @param {number} page - Page number
 */
export const getTMDBPopular = async (type = 'movie', page = 1) => {
  return withRetry(async () => {
    const response = await fetchWithTimeout(
      `${API_CONFIG.TMDB_BASE}/${type}/popular?api_key=${API_CONFIG.TMDB_KEY}&page=${page}`
    );

    if (!response.ok) {
      throw new Error(`TMDB popular error: ${response.status}`);
    }

    return await response.json();
  });
};

/**
 * Get TMDB top rated content
 * @param {string} type - 'movie' or 'tv'
 */
export const getTMDBTopRated = async (type = 'movie') => {
  return withRetry(async () => {
    const response = await fetchWithTimeout(
      `${API_CONFIG.TMDB_BASE}/${type}/top_rated?api_key=${API_CONFIG.TMDB_KEY}`
    );

    if (!response.ok) {
      throw new Error(`TMDB top rated error: ${response.status}`);
    }

    return await response.json();
  });
};

/**
 * Get TMDB now playing movies
 */
export const getTMDBNowPlaying = async () => {
  try {
    const response = await fetch(
      `${API_CONFIG.TMDB_BASE}/movie/now_playing?api_key=${API_CONFIG.TMDB_KEY}`
    );

    if (!response.ok) {
      throw new Error(`TMDB now playing error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('TMDB now playing error:', error);
    throw error;
  }
};

/**
 * Get TMDB TV show season details
 * @param {number} tvId - TV show ID
 * @param {number} seasonNumber - Season number
 */
export const getTMDBSeason = async (tvId, seasonNumber) => {
  try {
    const response = await fetch(
      `${API_CONFIG.TMDB_BASE}/tv/${tvId}/season/${seasonNumber}?api_key=${API_CONFIG.TMDB_KEY}`
    );

    if (!response.ok) {
      throw new Error(`TMDB season error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('TMDB season error:', error);
    throw error;
  }
};

/**
 * Get TMDB upcoming movies
 */
export const getTMDBUpcoming = async () => {
  try {
    const response = await fetch(
      `${API_CONFIG.TMDB_BASE}/movie/upcoming?api_key=${API_CONFIG.TMDB_KEY}`
    );

    if (!response.ok) {
      throw new Error(`TMDB upcoming error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('TMDB upcoming error:', error);
    throw error;
  }
};

/**
 * Get TMDB airing today TV shows
 */
export const getTMDBAiringToday = async () => {
  try {
    const response = await fetch(
      `${API_CONFIG.TMDB_BASE}/tv/airing_today?api_key=${API_CONFIG.TMDB_KEY}`
    );

    if (!response.ok) {
      throw new Error(`TMDB airing today error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('TMDB airing today error:', error);
    throw error;
  }
};

// ========================================
// Gifted Movies API Functions
// ========================================

/**
 * Search Gifted Movies API
 * @param {string} query - Search query
 */
export const searchMovies = async (query) => {
  return withRetry(async () => {
    const response = await fetchWithTimeout(
      `${API_CONFIG.GIFTED_SEARCH}/${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  });
};

/**
 * Get Gifted Movies info
 * @param {string} subjectId - Movie/TV series ID
 */
export const getMovieInfo = async (subjectId) => {
  return withRetry(async () => {
    const response = await fetchWithTimeout(
      `${API_CONFIG.GIFTED_INFO}/${subjectId}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch movie info: ${response.status}`);
    }

    const data = await response.json();
    return data;
  });
};

/**
 * Get Gifted Movies download sources
 * @param {string} subjectId - Movie ID
 * @param {number} season - Season number (for TV shows)
 * @param {number} episode - Episode number (for TV shows)
 */
export const getDownloadSources = async (subjectId, season = null, episode = null) => {
  return withRetry(async () => {
    let url = `${API_CONFIG.GIFTED_SOURCES}/${subjectId}`;

    if (season !== null && episode !== null) {
      url += `?season=${season}&episode=${episode}`;
    } else if (season !== null) {
      url += `?season=${season}`;
    }

    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch sources: ${response.status}`);
    }

    const data = await response.json();
    return data;
  });
};

/**
 * Get Gifted Movies API trending content
 */
export const getGiftedTrending = async () => {
  return withRetry(async () => {
    const response = await fetchWithTimeout(API_CONFIG.GIFTED_TRENDING);

    if (!response.ok) {
      throw new Error(`Gifted trending error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  });
};

/**
 * Get Gifted Movies API homepage content (banners, platforms, etc.)
 */
export const getGiftedHomepage = async () => {
  return withRetry(async () => {
    const response = await fetchWithTimeout(API_CONFIG.GIFTED_HOMEPAGE);

    if (!response.ok) {
      throw new Error(`Gifted homepage error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  });
};

/**
 * Format Gifted trending item to match TMDB format
 * @param {Object} item - Gifted API item
 */
export const formatGiftedToTMDB = (item) => {
  return {
    id: item.subjectId,
    title: item.title,
    name: item.title,
    overview: item.description || '',
    poster_path: null, // Will use cover.url directly
    backdrop_path: null,
    vote_average: parseFloat(item.imdbRatingValue) || 0,
    vote_count: item.imdbRatingCount || 0,
    release_date: item.releaseDate,
    first_air_date: item.subjectType === 2 ? item.releaseDate : undefined,
    media_type: item.subjectType === 1 ? 'movie' : 'tv',
    genre_ids: [],
    popularity: 0,
    // Gifted-specific fields
    gifted_id: item.subjectId,
    gifted_cover: item.cover?.url || item.thumbnail,
    gifted_poster: item.cover?.url || item.thumbnail,
    gifted_stills: item.stills?.url,
    gifted_genre: item.genre,
    gifted_country: item.countryName,
    gifted_subtitles: item.subtitles,
    avgHueLight: item.cover?.avgHueLight,
    avgHueDark: item.cover?.avgHueDark,
  };
};

/**
 * Get trending content with Gifted API fallback
 * First tries TMDB, falls back to Gifted if TMDB fails
 * @param {string} mediaType - 'all', 'movie', or 'tv'
 * @param {string} timeWindow - 'day' or 'week'
 */
export const getTrendingWithFallback = async (mediaType = 'all', timeWindow = 'week') => {
  try {
    // Try TMDB first
    const tmdbData = await getTMDBTrending(mediaType, timeWindow);
    return {
      source: 'tmdb',
      ...tmdbData
    };
  } catch (tmdbError) {
    console.warn('TMDB trending failed, falling back to Gifted API:', tmdbError.message);

    try {
      // Fallback to Gifted API
      const giftedData = await getGiftedTrending();

      if (giftedData.status === 200 && giftedData.results?.subjectList) {
        // Filter by media type if specified
        let items = giftedData.results.subjectList;

        if (mediaType === 'movie') {
          items = items.filter(item => item.subjectType === 1);
        } else if (mediaType === 'tv') {
          items = items.filter(item => item.subjectType === 2);
        }

        // Format to match TMDB structure
        const formattedResults = items.map(formatGiftedToTMDB);

        return {
          source: 'gifted',
          page: 1,
          results: formattedResults,
          total_pages: 1,
          total_results: formattedResults.length
        };
      }

      throw new Error('Invalid Gifted API response');
    } catch (giftedError) {
      console.error('Both TMDB and Gifted trending APIs failed:', giftedError.message);
      throw giftedError;
    }
  }
};

/**
 * Get homepage content with Gifted API (banners, featured content)
 */
export const getHomepageWithFallback = async () => {
  try {
    // Get both TMDB trending and Gifted homepage for rich content
    const [tmdbTrending, giftedHomepage] = await Promise.allSettled([
      getTMDBTrending('all', 'day'),
      getGiftedHomepage()
    ]);

    const result = {
      trending: tmdbTrending.status === 'fulfilled' ? tmdbTrending.value : null,
      giftedBanners: null,
      giftedPlatforms: null,
      source: 'mixed'
    };

    if (giftedHomepage.status === 'fulfilled' && giftedHomepage.value.status === 200) {
      const giftedData = giftedHomepage.value.results;

      // Extract banner items
      const bannerOperation = giftedData.operatingList?.find(op => op.type === 'BANNER');
      if (bannerOperation?.banner?.items) {
        result.giftedBanners = bannerOperation.banner.items.map(item => ({
          id: item.subjectId,
          title: item.title,
          image: item.image?.url,
          type: item.subjectType === 1 ? 'movie' : 'tv'
        }));
      }

      // Extract platforms
      result.giftedPlatforms = giftedData.platformList || [];
    }

    // If TMDB failed, try to use Gifted trending as fallback
    if (!result.trending) {
      try {
        const giftedTrending = await getGiftedTrending();
        if (giftedTrending.status === 200 && giftedTrending.results?.subjectList) {
          result.trending = {
            source: 'gifted',
            results: giftedTrending.results.subjectList.map(formatGiftedToTMDB)
          };
        }
      } catch (e) {
        console.error('Gifted trending fallback also failed:', e.message);
      }
    }

    return result;
  } catch (error) {
    console.error('Homepage data fetch error:', error);
    throw error;
  }
};

// ========================================
// Helper Functions
// ========================================

/**
 * Format TMDB data for consistent use
 * @param {Object} item - TMDB item
 */
export const formatTMDBData = (item) => {
  const isTV = item.media_type === 'tv' || item.first_air_date !== undefined;

  return {
    id: item.id,
    tmdbId: item.id,
    title: item.title || item.name,
    description: item.overview || '',
    releaseDate: item.release_date || item.first_air_date || '',
    year: (item.release_date || item.first_air_date || '').split('-')[0],
    duration: item.runtime || null,
    genre: item.genres?.map(g => g.name).join(', ') || '',
    genreIds: item.genre_ids || [],
    poster: item.poster_path ? `${API_CONFIG.TMDB_POSTER}${item.poster_path}` : null,
    backdrop: item.backdrop_path ? `${API_CONFIG.TMDB_IMG}${item.backdrop_path}` : null,
    rating: item.vote_average || 0,
    ratingCount: item.vote_count || 0,
    popularity: item.popularity || 0,
    type: isTV ? 'tv' : 'movie',
    mediaType: item.media_type || (isTV ? 'tv' : 'movie'),
    adult: item.adult || false,
    originalLanguage: item.original_language || 'en',
    originalTitle: item.original_title || item.original_name || '',
  };
};

/**
 * Format Gifted Movies data
 * @param {Object} movie - Gifted API movie data
 */
export const formatMovieData = (movie) => {
  return {
    id: movie.subjectId,
    title: movie.title,
    description: movie.description || '',
    releaseDate: movie.releaseDate,
    duration: movie.duration,
    genre: movie.genre,
    poster: movie.cover?.url || movie.thumbnail,
    rating: movie.imdbRatingValue,
    ratingCount: movie.imdbRatingCount,
    country: movie.countryName,
    subtitles: movie.subtitles,
    hasResource: movie.hasResource,
    trailer: movie.trailer,
    type: movie.subjectType === 1 ? 'movie' : 'tv',
  };
};

/**
 * Check if content is a TV show
 * @param {Object} movie - Movie data
 */
export const isTVShow = (movie) => {
  return movie.subjectType === 2 || movie.type === 'tv' || movie.media_type === 'tv';
};

/**
 * Get poster URL from TMDB
 * @param {string} path - Poster path
 * @param {string} size - Size (w500, original, etc.)
 */
export const getTMDBPosterURL = (path, size = 'w500') => {
  if (!path) return null;
  const baseURL = size === 'original' ? API_CONFIG.TMDB_IMG : `https://image.tmdb.org/t/p/${size}`;
  return `${baseURL}${path}`;
};

/**
 * Get backdrop URL from TMDB
 * @param {string} path - Backdrop path
 */
export const getTMDBBackdropURL = (path) => {
  if (!path) return null;
  return `${API_CONFIG.TMDB_IMG}${path}`;
};

/**
 * Combine TMDB and Gifted data for enhanced movie info
 * @param {string} giftedId - Gifted Movies ID
 * @param {string} tmdbQuery - Query to search TMDB
 */
export const getEnhancedMovieData = async (giftedId, tmdbQuery) => {
  try {
    // Get Gifted data for download sources
    const giftedData = await getMovieInfo(giftedId);

    // Search TMDB for rich metadata
    const tmdbSearch = await searchTMDB(tmdbQuery);
    const tmdbMatch = tmdbSearch.results?.[0];

    let tmdbDetails = null;
    if (tmdbMatch) {
      const type = tmdbMatch.media_type === 'tv' ? 'tv' : 'movie';
      tmdbDetails = await getTMDBDetails(tmdbMatch.id, type);
    }

    return {
      gifted: giftedData,
      tmdb: tmdbDetails,
      combined: {
        ...formatMovieData(giftedData.results),
        ...(tmdbDetails ? formatTMDBData(tmdbDetails) : {}),
      }
    };
  } catch (error) {
    console.error('Enhanced data error:', error);
    throw error;
  }
};

/**
 * Find best match from Gifted search results
 * @param {Array} items - Search results items
 * @param {string} title - Title to match
 * @param {string} type - 'movie' or 'tv'
 */
export const findBestMatch = (items, title, type) => {
  if (!items || items.length === 0) return null;

  const targetType = type === 'movie' ? 1 : 2;
  const normalizedTitle = title.toLowerCase().trim();

  // 1. Strict Type Match & Exact Title Match
  const exactMatch = items.find(item =>
    item.subjectType === targetType &&
    item.title.toLowerCase().trim() === normalizedTitle
  );
  if (exactMatch) return exactMatch;

  // 2. Strict Type Match & Contains Title
  const typeMatch = items.find(item =>
    item.subjectType === targetType &&
    item.title.toLowerCase().includes(normalizedTitle)
  );
  if (typeMatch) return typeMatch;

  // 3. Fallback: Just Type Match (first one)
  const firstTypeMatch = items.find(item => item.subjectType === targetType);
  if (firstTypeMatch) return firstTypeMatch;

  // 4. Last Resort: Fuzzy Title Match (ignoring type)
  // This helps if API misclassifies something
  return items.find(item => item.title.toLowerCase().includes(normalizedTitle));
};

export default {
  // TMDB functions
  getTMDBTrending,
  getTMDBDetails,
  searchTMDB,
  getTMDBDiscover,
  getTMDBGenres,
  getTMDBPopular,
  getTMDBTopRated,
  getTMDBNowPlaying,
  getTMDBSeason,
  getTMDBUpcoming,
  getTMDBAiringToday,

  // Gifted functions
  searchMovies,
  getMovieInfo,
  getDownloadSources,
  findBestMatch,
  getGiftedTrending,
  getGiftedHomepage,

  // Fallback functions (TMDB with Gifted fallback)
  getTrendingWithFallback,
  getHomepageWithFallback,

  // Helper functions
  formatTMDBData,
  formatMovieData,
  formatGiftedToTMDB,
  isTVShow,
  getTMDBPosterURL,
  getTMDBBackdropURL,
  getEnhancedMovieData,
};
