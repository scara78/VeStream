package com.vestream.data.local

import androidx.room.*
import com.vestream.data.model.HistoryItem
import com.vestream.data.model.WatchlistItem
import kotlinx.coroutines.flow.Flow

/**
 * DAO for Watchlist operations
 */
@Dao
interface WatchlistDao {
    
    @Query("SELECT * FROM watchlist ORDER BY addedAt DESC")
    fun getAll(): Flow<List<WatchlistItem>>
    
    @Query("SELECT * FROM watchlist WHERE id = :id")
    suspend fun getById(id: Int): WatchlistItem?
    
    @Query("SELECT EXISTS(SELECT 1 FROM watchlist WHERE id = :id)")
    fun isInWatchlist(id: Int): Flow<Boolean>
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(item: WatchlistItem)
    
    @Delete
    suspend fun delete(item: WatchlistItem)
    
    @Query("DELETE FROM watchlist WHERE id = :id")
    suspend fun deleteById(id: Int)
    
    @Query("DELETE FROM watchlist")
    suspend fun clearAll()
}

/**
 * DAO for History operations
 */
@Dao
interface HistoryDao {
    
    @Query("SELECT * FROM history ORDER BY lastWatched DESC")
    fun getAll(): Flow<List<HistoryItem>>
    
    @Query("SELECT * FROM history ORDER BY lastWatched DESC LIMIT :limit")
    fun getRecent(limit: Int = 10): Flow<List<HistoryItem>>
    
    @Query("SELECT * FROM history WHERE id = :id")
    suspend fun getById(id: Int): HistoryItem?
    
    @Query("SELECT progress FROM history WHERE id = :id")
    suspend fun getProgress(id: Int): Long?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(item: HistoryItem)
    
    @Query("UPDATE history SET progress = :progress, duration = :duration, lastWatched = :timestamp WHERE id = :id")
    suspend fun updateProgress(id: Int, progress: Long, duration: Long, timestamp: Long = System.currentTimeMillis())
    
    @Delete
    suspend fun delete(item: HistoryItem)
    
    @Query("DELETE FROM history WHERE id = :id")
    suspend fun deleteById(id: Int)
    
    @Query("DELETE FROM history")
    suspend fun clearAll()
}

/**
 * VeStream Room Database
 */
@Database(
    entities = [WatchlistItem::class, HistoryItem::class],
    version = 1,
    exportSchema = false
)
abstract class VeStreamDatabase : RoomDatabase() {
    abstract fun watchlistDao(): WatchlistDao
    abstract fun historyDao(): HistoryDao
}
