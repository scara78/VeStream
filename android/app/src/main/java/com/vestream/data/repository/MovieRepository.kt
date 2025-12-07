package com.vestream.data.repository

import com.vestream.BuildConfig
import com.vestream.data.api.GiftedApi
import com.vestream.data.api.TmdbApi
import com.vestream.data.model.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Repository that combines TMDB and Gifted APIs with fallback logic
 */
@Singleton
class MovieRepository @Inject constructor(
    private val tmdbApi: TmdbApi,
    private val giftedApi: GiftedApi
) {
    private val apiKey = BuildConfig.TMDB_API_KEY
    
    /**
     * Get trending content with Gifted fallback
     */
    suspend fun getTrending(mediaType: String = "all", timeWindow: String = "week"): Result<List<MediaItem>> {
        return withContext(Dispatchers.IO) {
            try {
                // Try TMDB first
                val response = tmdbApi.getTrending(mediaType, timeWindow, apiKey)
                Result.success(response.results)
            } catch (e: Exception) {
                // Fallback to Gifted API
                try {
                    val giftedResponse = giftedApi.getTrending()
                    if (giftedResponse.success && giftedResponse.results != null) {
                        val items = giftedResponse.results.subjectList.map { it.toMediaItem() }
                        Result.success(items)
                    } else {
                        Result.failure(e)
                    }
                } catch (e2: Exception) {
                    Result.failure(e2)
                }
            }
        }
    }
    
    /**
     * Get popular movies
     */
    suspend fun getPopularMovies(page: Int = 1): Result<List<MediaItem>> {
        return withContext(Dispatchers.IO) {
            try {
                val response = tmdbApi.getPopularMovies(apiKey, page)
                Result.success(response.results.map { it.copy(mediaType = "movie") })
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }
    
    /**
     * Get popular TV shows
     */
    suspend fun getPopularTV(page: Int = 1): Result<List<MediaItem>> {
        return withContext(Dispatchers.IO) {
            try {
                val response = tmdbApi.getPopularTV(apiKey, page)
                Result.success(response.results.map { it.copy(mediaType = "tv") })
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }
    
    /**
     * Get top rated movies
     */
    suspend fun getTopRatedMovies(page: Int = 1): Result<List<MediaItem>> {
        return withContext(Dispatchers.IO) {
            try {
                val response = tmdbApi.getTopRatedMovies(apiKey, page)
                Result.success(response.results.map { it.copy(mediaType = "movie") })
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }
    
    /**
     * Get now playing movies
     */
    suspend fun getNowPlaying(page: Int = 1): Result<List<MediaItem>> {
        return withContext(Dispatchers.IO) {
            try {
                val response = tmdbApi.getNowPlayingMovies(apiKey, page)
                Result.success(response.results.map { it.copy(mediaType = "movie") })
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }
    
    /**
     * Search for movies and TV shows
     */
    suspend fun search(query: String, page: Int = 1): Result<List<MediaItem>> {
        return withContext(Dispatchers.IO) {
            try {
                val response = tmdbApi.search(apiKey, query, page)
                // Filter out people results
                val filtered = response.results.filter { 
                    it.mediaType == "movie" || it.mediaType == "tv" 
                }
                Result.success(filtered)
            } catch (e: Exception) {
                // Fallback to Gifted
                try {
                    val giftedResponse = giftedApi.search(query)
                    if (giftedResponse.success && giftedResponse.results != null) {
                        val items = giftedResponse.results.results.map { it.toMediaItem() }
                        Result.success(items)
                    } else {
                        Result.failure(e)
                    }
                } catch (e2: Exception) {
                    Result.failure(e2)
                }
            }
        }
    }
    
    /**
     * Get media details
     */
    suspend fun getDetails(mediaType: String, id: Int): Result<MediaDetails> {
        return withContext(Dispatchers.IO) {
            try {
                val response = tmdbApi.getDetails(mediaType, id, apiKey)
                Result.success(response)
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }
    
    /**
     * Get video sources from Gifted API
     */
    suspend fun getVideoSources(
        id: String,
        type: String,
        season: Int? = null,
        episode: Int? = null
    ): Result<List<GiftedDownloadSource>> {
        return withContext(Dispatchers.IO) {
            try {
                val response = giftedApi.getSources(id, type, season, episode)
                if (response.success && response.results != null) {
                    Result.success(response.results.sources)
                } else {
                    Result.failure(Exception("No sources found"))
                }
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }
}
