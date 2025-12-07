package com.vestream.data.api

import com.vestream.data.model.MediaDetails
import com.vestream.data.model.MediaItem
import com.vestream.data.model.TmdbResponse
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query

/**
 * TMDB API Service
 */
interface TmdbApi {
    
    @GET("trending/{media_type}/{time_window}")
    suspend fun getTrending(
        @Path("media_type") mediaType: String = "all",
        @Path("time_window") timeWindow: String = "week",
        @Query("api_key") apiKey: String
    ): TmdbResponse<MediaItem>
    
    @GET("movie/popular")
    suspend fun getPopularMovies(
        @Query("api_key") apiKey: String,
        @Query("page") page: Int = 1
    ): TmdbResponse<MediaItem>
    
    @GET("tv/popular")
    suspend fun getPopularTV(
        @Query("api_key") apiKey: String,
        @Query("page") page: Int = 1
    ): TmdbResponse<MediaItem>
    
    @GET("movie/top_rated")
    suspend fun getTopRatedMovies(
        @Query("api_key") apiKey: String,
        @Query("page") page: Int = 1
    ): TmdbResponse<MediaItem>
    
    @GET("tv/top_rated")
    suspend fun getTopRatedTV(
        @Query("api_key") apiKey: String,
        @Query("page") page: Int = 1
    ): TmdbResponse<MediaItem>
    
    @GET("movie/now_playing")
    suspend fun getNowPlayingMovies(
        @Query("api_key") apiKey: String,
        @Query("page") page: Int = 1
    ): TmdbResponse<MediaItem>
    
    @GET("search/multi")
    suspend fun search(
        @Query("api_key") apiKey: String,
        @Query("query") query: String,
        @Query("page") page: Int = 1
    ): TmdbResponse<MediaItem>
    
    @GET("{media_type}/{id}")
    suspend fun getDetails(
        @Path("media_type") mediaType: String,
        @Path("id") id: Int,
        @Query("api_key") apiKey: String
    ): MediaDetails
}
