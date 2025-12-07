package com.vestream.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.Date

/**
 * Watchlist item stored in Room database
 */
@Entity(tableName = "watchlist")
data class WatchlistItem(
    @PrimaryKey val id: Int,
    val title: String,
    val posterPath: String?,
    val backdropPath: String?,
    val mediaType: String,
    val voteAverage: Double,
    val overview: String?,
    val releaseDate: String?,
    val addedAt: Long = System.currentTimeMillis(),
    val giftedId: String? = null,
    val giftedCover: String? = null
) {
    fun toMediaItem(): MediaItem = MediaItem(
        id = id,
        title = if (mediaType == "movie") title else null,
        name = if (mediaType == "tv") title else null,
        posterPath = posterPath,
        backdropPath = backdropPath,
        mediaType = mediaType,
        voteAverage = voteAverage,
        overview = overview,
        releaseDate = if (mediaType == "movie") releaseDate else null,
        firstAirDate = if (mediaType == "tv") releaseDate else null,
        giftedId = giftedId,
        giftedCover = giftedCover
    )
    
    companion object {
        fun fromMediaItem(item: MediaItem): WatchlistItem = WatchlistItem(
            id = item.id,
            title = item.displayTitle,
            posterPath = item.posterPath,
            backdropPath = item.backdropPath,
            mediaType = item.displayType,
            voteAverage = item.voteAverage,
            overview = item.overview,
            releaseDate = item.releaseDate ?: item.firstAirDate,
            giftedId = item.giftedId,
            giftedCover = item.giftedCover
        )
    }
}

/**
 * Watch history item stored in Room database
 */
@Entity(tableName = "history")
data class HistoryItem(
    @PrimaryKey val id: Int,
    val title: String,
    val posterPath: String?,
    val backdropPath: String?,
    val mediaType: String,
    val voteAverage: Double,
    val overview: String?,
    val releaseDate: String?,
    val lastWatched: Long = System.currentTimeMillis(),
    val progress: Long = 0L, // Progress in milliseconds
    val duration: Long = 0L, // Duration in milliseconds
    val season: Int? = null,
    val episode: Int? = null,
    val giftedId: String? = null,
    val giftedCover: String? = null
) {
    val progressPercent: Float
        get() = if (duration > 0) (progress.toFloat() / duration.toFloat()) * 100f else 0f
    
    fun toMediaItem(): MediaItem = MediaItem(
        id = id,
        title = if (mediaType == "movie") title else null,
        name = if (mediaType == "tv") title else null,
        posterPath = posterPath,
        backdropPath = backdropPath,
        mediaType = mediaType,
        voteAverage = voteAverage,
        overview = overview,
        releaseDate = if (mediaType == "movie") releaseDate else null,
        firstAirDate = if (mediaType == "tv") releaseDate else null,
        giftedId = giftedId,
        giftedCover = giftedCover
    )
    
    companion object {
        fun fromMediaItem(
            item: MediaItem,
            progress: Long = 0L,
            duration: Long = 0L,
            season: Int? = null,
            episode: Int? = null
        ): HistoryItem = HistoryItem(
            id = item.id,
            title = item.displayTitle,
            posterPath = item.posterPath,
            backdropPath = item.backdropPath,
            mediaType = item.displayType,
            voteAverage = item.voteAverage,
            overview = item.overview,
            releaseDate = item.releaseDate ?: item.firstAirDate,
            progress = progress,
            duration = duration,
            season = season,
            episode = episode,
            giftedId = item.giftedId,
            giftedCover = item.giftedCover
        )
    }
}
