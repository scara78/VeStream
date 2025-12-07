package com.vestream.data.model

import com.google.gson.annotations.SerializedName

/**
 * TMDB Movie/TV Response
 */
data class TmdbResponse<T>(
    val page: Int = 1,
    val results: List<T> = emptyList(),
    @SerializedName("total_pages") val totalPages: Int = 0,
    @SerializedName("total_results") val totalResults: Int = 0
)

/**
 * TMDB Media Item (Movie or TV Show)
 */
data class MediaItem(
    val id: Int,
    val title: String? = null,
    val name: String? = null,
    val overview: String? = null,
    @SerializedName("poster_path") val posterPath: String? = null,
    @SerializedName("backdrop_path") val backdropPath: String? = null,
    @SerializedName("vote_average") val voteAverage: Double = 0.0,
    @SerializedName("vote_count") val voteCount: Int = 0,
    @SerializedName("release_date") val releaseDate: String? = null,
    @SerializedName("first_air_date") val firstAirDate: String? = null,
    @SerializedName("media_type") val mediaType: String? = null,
    @SerializedName("genre_ids") val genreIds: List<Int> = emptyList(),
    val popularity: Double = 0.0,
    // Gifted API fields
    var giftedId: String? = null,
    var giftedCover: String? = null,
    var giftedPoster: String? = null,
    var avgHueLight: String? = null,
    var avgHueDark: String? = null
) {
    val displayTitle: String get() = title ?: name ?: "Unknown"
    val displayYear: String get() = (releaseDate ?: firstAirDate)?.take(4) ?: ""
    val displayType: String get() = mediaType ?: if (firstAirDate != null) "tv" else "movie"
    
    val posterUrl: String? get() = when {
        posterPath != null -> "https://image.tmdb.org/t/p/w500$posterPath"
        giftedPoster != null -> giftedPoster
        giftedCover != null -> giftedCover
        else -> null
    }
    
    val backdropUrl: String? get() = when {
        backdropPath != null -> "https://image.tmdb.org/t/p/original$backdropPath"
        giftedCover != null -> giftedCover
        else -> null
    }
}

/**
 * TMDB Details Response
 */
data class MediaDetails(
    val id: Int,
    val title: String? = null,
    val name: String? = null,
    val overview: String? = null,
    @SerializedName("poster_path") val posterPath: String? = null,
    @SerializedName("backdrop_path") val backdropPath: String? = null,
    @SerializedName("vote_average") val voteAverage: Double = 0.0,
    @SerializedName("release_date") val releaseDate: String? = null,
    @SerializedName("first_air_date") val firstAirDate: String? = null,
    val runtime: Int? = null,
    val genres: List<Genre> = emptyList(),
    @SerializedName("number_of_seasons") val numberOfSeasons: Int? = null,
    @SerializedName("number_of_episodes") val numberOfEpisodes: Int? = null,
    val seasons: List<Season>? = null
)

data class Genre(
    val id: Int,
    val name: String
)

data class Season(
    val id: Int,
    @SerializedName("season_number") val seasonNumber: Int,
    val name: String,
    @SerializedName("episode_count") val episodeCount: Int,
    @SerializedName("poster_path") val posterPath: String?
)
