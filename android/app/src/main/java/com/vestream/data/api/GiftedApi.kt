package com.vestream.data.api

import com.vestream.data.model.*
import retrofit2.http.GET
import retrofit2.http.Query

/**
 * Gifted Movies API Service
 * Fallback API when TMDB fails
 */
interface GiftedApi {
    
    @GET("trending")
    suspend fun getTrending(): GiftedResponse<GiftedTrendingResults>
    
    @GET("homepage")
    suspend fun getHomepage(): GiftedResponse<Map<String, Any>>
    
    @GET("search")
    suspend fun search(
        @Query("query") query: String
    ): GiftedResponse<GiftedSearchResults>
    
    @GET("info")
    suspend fun getInfo(
        @Query("id") id: String
    ): GiftedResponse<GiftedSubject>
    
    @GET("sources")
    suspend fun getSources(
        @Query("id") id: String,
        @Query("type") type: String = "movie",
        @Query("season") season: Int? = null,
        @Query("episode") episode: Int? = null
    ): GiftedResponse<GiftedSourcesResults>
}
