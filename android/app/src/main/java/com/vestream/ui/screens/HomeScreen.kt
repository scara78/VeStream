package com.vestream.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.vestream.data.model.MediaItem
import com.vestream.data.repository.MovieRepository
import com.vestream.ui.components.ContentRow
import com.vestream.ui.components.HeroSection
import com.vestream.ui.theme.VeStreamColors
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * Home Screen ViewModel
 */
@HiltViewModel
class HomeViewModel @Inject constructor(
    private val repository: MovieRepository
) : ViewModel() {
    
    private val _trending = MutableStateFlow<List<MediaItem>>(emptyList())
    val trending: StateFlow<List<MediaItem>> = _trending
    
    private val _popular = MutableStateFlow<List<MediaItem>>(emptyList())
    val popular: StateFlow<List<MediaItem>> = _popular
    
    private val _topRated = MutableStateFlow<List<MediaItem>>(emptyList())
    val topRated: StateFlow<List<MediaItem>> = _topRated
    
    private val _nowPlaying = MutableStateFlow<List<MediaItem>>(emptyList())
    val nowPlaying: StateFlow<List<MediaItem>> = _nowPlaying
    
    private val _isLoading = MutableStateFlow(true)
    val isLoading: StateFlow<Boolean> = _isLoading
    
    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error
    
    init {
        loadContent()
    }
    
    fun loadContent() {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            
            // Load all content in parallel
            val trendingResult = repository.getTrending()
            val popularResult = repository.getPopularMovies()
            val topRatedResult = repository.getTopRatedMovies()
            val nowPlayingResult = repository.getNowPlaying()
            
            trendingResult.onSuccess { _trending.value = it }
            popularResult.onSuccess { _popular.value = it }
            topRatedResult.onSuccess { _topRated.value = it }
            nowPlayingResult.onSuccess { _nowPlaying.value = it }
            
            if (trendingResult.isFailure && popularResult.isFailure) {
                _error.value = "Failed to load content"
            }
            
            _isLoading.value = false
        }
    }
}

/**
 * Home Screen Composable
 */
@Composable
fun HomeScreen(
    onItemClick: (MediaItem) -> Unit,
    viewModel: HomeViewModel = hiltViewModel()
) {
    val trending by viewModel.trending.collectAsState()
    val popular by viewModel.popular.collectAsState()
    val topRated by viewModel.topRated.collectAsState()
    val nowPlaying by viewModel.nowPlaying.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val error by viewModel.error.collectAsState()
    
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(VeStreamColors.BgMain)
    ) {
        if (isLoading && trending.isEmpty()) {
            // Loading State
            CircularProgressIndicator(
                modifier = Modifier.align(Alignment.Center),
                color = VeStreamColors.JunglePrimary
            )
        } else if (error != null && trending.isEmpty()) {
            // Error State
            Column(
                modifier = Modifier.align(Alignment.Center),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = error ?: "Something went wrong",
                    color = VeStreamColors.TextSecondary
                )
                Spacer(modifier = Modifier.height(16.dp))
                Button(
                    onClick = { viewModel.loadContent() },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = VeStreamColors.JunglePrimary
                    )
                ) {
                    Text("Try Again", color = VeStreamColors.BgMain)
                }
            }
        } else {
            // Content
            LazyColumn(
                modifier = Modifier.fillMaxSize()
            ) {
                // Hero Section
                item {
                    HeroSection(
                        item = trending.firstOrNull(),
                        onPlayClick = { trending.firstOrNull()?.let { onItemClick(it) } },
                        onAddToListClick = { /* TODO: Add to watchlist */ }
                    )
                }
                
                // Trending
                if (trending.isNotEmpty()) {
                    item {
                        ContentRow(
                            title = "🔥 Trending Now",
                            items = trending.take(10),
                            onItemClick = onItemClick,
                            modifier = Modifier.padding(top = 24.dp)
                        )
                    }
                }
                
                // Now Playing
                if (nowPlaying.isNotEmpty()) {
                    item {
                        ContentRow(
                            title = "🎬 Now Playing",
                            items = nowPlaying.take(10),
                            onItemClick = onItemClick,
                            modifier = Modifier.padding(top = 16.dp)
                        )
                    }
                }
                
                // Popular
                if (popular.isNotEmpty()) {
                    item {
                        ContentRow(
                            title = "⭐ Popular Movies",
                            items = popular.take(10),
                            onItemClick = onItemClick,
                            modifier = Modifier.padding(top = 16.dp)
                        )
                    }
                }
                
                // Top Rated
                if (topRated.isNotEmpty()) {
                    item {
                        ContentRow(
                            title = "🏆 Top Rated",
                            items = topRated.take(10),
                            onItemClick = onItemClick,
                            modifier = Modifier.padding(top = 16.dp, bottom = 80.dp)
                        )
                    }
                }
            }
        }
    }
}
