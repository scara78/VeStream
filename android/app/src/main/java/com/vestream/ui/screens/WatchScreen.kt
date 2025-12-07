package com.vestream.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.vestream.data.model.GiftedDownloadSource
import com.vestream.data.model.MediaDetails
import com.vestream.data.model.MediaItem
import com.vestream.data.repository.MovieRepository
import com.vestream.ui.components.VeStreamPlayer
import com.vestream.ui.theme.VeStreamColors
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * Watch Screen ViewModel
 */
@HiltViewModel
class WatchViewModel @Inject constructor(
    private val repository: MovieRepository
) : ViewModel() {
    
    private val _details = MutableStateFlow<MediaDetails?>(null)
    val details: StateFlow<MediaDetails?> = _details
    
    private val _sources = MutableStateFlow<List<GiftedDownloadSource>>(emptyList())
    val sources: StateFlow<List<GiftedDownloadSource>> = _sources
    
    private val _selectedQuality = MutableStateFlow<String?>(null)
    val selectedQuality: StateFlow<String?> = _selectedQuality
    
    private val _isLoading = MutableStateFlow(true)
    val isLoading: StateFlow<Boolean> = _isLoading
    
    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error
    
    fun loadContent(mediaItem: MediaItem) {
        viewModelScope.launch {
            _isLoading.value = true
            
            // Load details
            repository.getDetails(
                mediaType = mediaItem.displayType,
                id = mediaItem.id
            ).onSuccess { details ->
                _details.value = details
            }
            
            // Load video sources from Gifted API
            val sourceId = mediaItem.giftedId ?: mediaItem.id.toString()
            repository.getVideoSources(
                id = sourceId,
                type = mediaItem.displayType
            ).onSuccess { sourcesList ->
                _sources.value = sourcesList
                // Auto-select highest quality
                if (sourcesList.isNotEmpty()) {
                    _selectedQuality.value = sourcesList.first().quality
                }
            }.onFailure {
                _error.value = "No sources available"
            }
            
            _isLoading.value = false
        }
    }
    
    fun selectQuality(quality: String) {
        _selectedQuality.value = quality
    }
    
    val currentVideoUrl: String?
        get() = sources.value.find { it.quality == selectedQuality.value }?.downloadUrl
}

/**
 * Watch Screen with Custom VeStream Player
 */
@Composable
fun WatchScreen(
    mediaItem: MediaItem,
    onBackClick: () -> Unit,
    viewModel: WatchViewModel = hiltViewModel()
) {
    val details by viewModel.details.collectAsState()
    val sources by viewModel.sources.collectAsState()
    val selectedQuality by viewModel.selectedQuality.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val error by viewModel.error.collectAsState()
    
    // Load content on first composition
    LaunchedEffect(mediaItem) {
        viewModel.loadContent(mediaItem)
    }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(VeStreamColors.BgMain)
    ) {
        // Custom VeStream Video Player
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(16f / 9f)
        ) {
            VeStreamPlayer(
                videoUrl = viewModel.currentVideoUrl,
                sources = sources,
                selectedQuality = selectedQuality,
                onQualityChange = { viewModel.selectQuality(it) },
                onBackClick = onBackClick,
                title = details?.title ?: details?.name ?: mediaItem.displayTitle
            )
            
            // Loading overlay
            if (isLoading) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color.Black.copy(alpha = 0.8f)),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(color = VeStreamColors.JunglePrimary)
                }
            }
        }
        
        // Content Below Player
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp)
        ) {
            // Title and Info
            item {
                Text(
                    text = details?.title ?: details?.name ?: mediaItem.displayTitle,
                    color = VeStreamColors.TextPrimary,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold
                )
                
                Spacer(modifier = Modifier.height(8.dp))
                
                Row(
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    details?.releaseDate?.take(4)?.let { year ->
                        Text(
                            text = year,
                            color = VeStreamColors.TextSecondary,
                            fontSize = 14.sp
                        )
                    }
                    
                    details?.runtime?.let { runtime ->
                        Text(
                            text = "${runtime / 60}h ${runtime % 60}m",
                            color = VeStreamColors.TextSecondary,
                            fontSize = 14.sp
                        )
                    }
                    
                    details?.voteAverage?.let { rating ->
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Star,
                                contentDescription = null,
                                tint = VeStreamColors.RatingGold,
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = String.format("%.1f", rating),
                                color = VeStreamColors.TextPrimary,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
                
                Spacer(modifier = Modifier.height(16.dp))
            }
            
            // Genres
            item {
                if (details?.genres?.isNotEmpty() == true) {
                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(details?.genres ?: emptyList()) { genre ->
                            Surface(
                                color = VeStreamColors.BgCard,
                                shape = RoundedCornerShape(16.dp)
                            ) {
                                Text(
                                    text = genre.name,
                                    color = VeStreamColors.TextSecondary,
                                    fontSize = 12.sp,
                                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                                )
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(16.dp))
                }
            }
            
            // Overview
            item {
                Text(
                    text = details?.overview ?: mediaItem.overview ?: "",
                    color = VeStreamColors.TextSecondary,
                    fontSize = 14.sp,
                    lineHeight = 22.sp
                )
                
                Spacer(modifier = Modifier.height(24.dp))
            }
            
            // Action Buttons
            item {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    OutlinedButton(
                        onClick = { /* TODO: Add to watchlist */ },
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.outlinedButtonColors(
                            contentColor = VeStreamColors.TextPrimary
                        )
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("My List")
                    }
                    
                    OutlinedButton(
                        onClick = { /* TODO: Like */ },
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.outlinedButtonColors(
                            contentColor = VeStreamColors.TextPrimary
                        )
                    ) {
                        Icon(Icons.Default.ThumbUp, contentDescription = null)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Like")
                    }
                    
                    OutlinedButton(
                        onClick = { /* TODO: Share */ },
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.outlinedButtonColors(
                            contentColor = VeStreamColors.TextPrimary
                        )
                    ) {
                        Icon(Icons.Default.Share, contentDescription = null)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Share")
                    }
                }
            }
            
            // Error message
            if (error != null) {
                item {
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = error ?: "",
                        color = VeStreamColors.Error,
                        fontSize = 14.sp
                    )
                }
            }
        }
    }
}
