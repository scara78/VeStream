package com.vestream.data.model

import com.google.gson.annotations.SerializedName

/**
 * Gifted API Response wrapper
 */
data class GiftedResponse<T>(
    val status: Int,
    val success: Boolean,
    val creator: String? = null,
    val results: T? = null
)

/**
 * Gifted Trending Results
 */
data class GiftedTrendingResults(
    val subjectList: List<GiftedSubject> = emptyList()
)

/**
 * Gifted Subject (Movie/TV item)
 */
data class GiftedSubject(
    val subjectId: String,
    val subjectType: Int, // 1 = movie, 2 = tv
    val title: String,
    val description: String? = null,
    val releaseDate: String? = null,
    val duration: Int = 0,
    val genre: String? = null,
    val cover: GiftedCover? = null,
    val countryName: String? = null,
    val imdbRatingValue: String? = null,
    val imdbRatingCount: Int? = null,
    val subtitles: String? = null,
    val hasResource: Boolean = false,
    val detailPath: String? = null
) {
    fun toMediaItem(): MediaItem = MediaItem(
        id = subjectId.hashCode(), // Convert to int for compatibility
        title = if (subjectType == 1) title else null,
        name = if (subjectType == 2) title else null,
        overview = description,
        releaseDate = if (subjectType == 1) releaseDate else null,
        firstAirDate = if (subjectType == 2) releaseDate else null,
        mediaType = if (subjectType == 1) "movie" else "tv",
        voteAverage = imdbRatingValue?.toDoubleOrNull() ?: 0.0,
        voteCount = imdbRatingCount ?: 0,
        giftedId = subjectId,
        giftedCover = cover?.url,
        giftedPoster = cover?.url,
        avgHueLight = cover?.avgHueLight,
        avgHueDark = cover?.avgHueDark
    )
}

data class GiftedCover(
    val url: String? = null,
    val width: Int = 0,
    val height: Int = 0,
    val avgHueLight: String? = null,
    val avgHueDark: String? = null
)

/**
 * Gifted Download Source
 */
data class GiftedDownloadSource(
    val quality: String,
    @SerializedName("download_url") val downloadUrl: String,
    val size: String? = null
)

/**
 * Gifted Sources Response
 */
data class GiftedSourcesResults(
    val sources: List<GiftedDownloadSource> = emptyList()
)

/**
 * Gifted Search Result
 */
data class GiftedSearchResults(
    val results: List<GiftedSubject> = emptyList()
)
