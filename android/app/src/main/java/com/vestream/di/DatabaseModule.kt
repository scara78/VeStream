package com.vestream.di

import android.content.Context
import androidx.room.Room
import com.vestream.data.local.HistoryDao
import com.vestream.data.local.VeStreamDatabase
import com.vestream.data.local.WatchlistDao
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {
    
    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): VeStreamDatabase {
        return Room.databaseBuilder(
            context,
            VeStreamDatabase::class.java,
            "vestream_database"
        ).build()
    }
    
    @Provides
    @Singleton
    fun provideWatchlistDao(database: VeStreamDatabase): WatchlistDao {
        return database.watchlistDao()
    }
    
    @Provides
    @Singleton
    fun provideHistoryDao(database: VeStreamDatabase): HistoryDao {
        return database.historyDao()
    }
}
