package com.vestream.data.repository

import com.vestream.data.local.HistoryDao
import com.vestream.data.local.WatchlistDao
import com.vestream.data.model.HistoryItem
import com.vestream.data.model.MediaItem
import com.vestream.data.model.WatchlistItem
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Repository for local library operations (Watchlist & History)
 */
@Singleton
class LibraryRepository @Inject constructor(
    private val watchlistDao: WatchlistDao,
    private val historyDao: HistoryDao
) {
    // ========== Watchlist ==========
    
    val watchlist: Flow<List<MediaItem>> = watchlistDao.getAll().map { items ->
        items.map { it.toMediaItem() }
    }
    
    fun isInWatchlist(id: Int): Flow<Boolean> = watchlistDao.isInWatchlist(id)
    
    suspend fun addToWatchlist(item: MediaItem) {
        watchlistDao.insert(WatchlistItem.fromMediaItem(item))
    }
    
    suspend fun removeFromWatchlist(id: Int) {
        watchlistDao.deleteById(id)
    }
    
    suspend fun toggleWatchlist(item: MediaItem): Boolean {
        val existing = watchlistDao.getById(item.id)
        return if (existing != null) {
            watchlistDao.deleteById(item.id)
            false // Removed
        } else {
            watchlistDao.insert(WatchlistItem.fromMediaItem(item))
            true // Added
        }
    }
    
    suspend fun clearWatchlist() {
        watchlistDao.clearAll()
    }
    
    // ========== History ==========
    
    val history: Flow<List<MediaItem>> = historyDao.getAll().map { items ->
        items.map { it.toMediaItem() }
    }
    
    val recentHistory: Flow<List<HistoryItem>> = historyDao.getRecent(10)
    
    suspend fun addToHistory(
        item: MediaItem,
        progress: Long = 0L,
        duration: Long = 0L,
        season: Int? = null,
        episode: Int? = null
    ) {
        historyDao.insert(
            HistoryItem.fromMediaItem(item, progress, duration, season, episode)
        )
    }
    
    suspend fun updateProgress(id: Int, progress: Long, duration: Long) {
        historyDao.updateProgress(id, progress, duration)
    }
    
    suspend fun getProgress(id: Int): Long {
        return historyDao.getProgress(id) ?: 0L
    }
    
    suspend fun removeFromHistory(id: Int) {
        historyDao.deleteById(id)
    }
    
    suspend fun clearHistory() {
        historyDao.clearAll()
    }
}
