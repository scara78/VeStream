package com.vestream.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.vestream.data.model.HistoryItem
import com.vestream.data.model.MediaItem
import com.vestream.data.repository.LibraryRepository
import com.vestream.ui.components.ContentRow
import com.vestream.ui.components.MovieCard
import com.vestream.ui.theme.VeStreamColors
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * Library Screen ViewModel
 */
@HiltViewModel
class LibraryViewModel @Inject constructor(
    private val libraryRepository: LibraryRepository
) : ViewModel() {
    
    private val _watchlist = MutableStateFlow<List<MediaItem>>(emptyList())
    val watchlist: StateFlow<List<MediaItem>> = _watchlist
    
    private val _history = MutableStateFlow<List<MediaItem>>(emptyList())
    val history: StateFlow<List<MediaItem>> = _history
    
    private val _recentHistory = MutableStateFlow<List<HistoryItem>>(emptyList())
    val recentHistory: StateFlow<List<HistoryItem>> = _recentHistory
    
    private val _selectedTab = MutableStateFlow(0)
    val selectedTab: StateFlow<Int> = _selectedTab
    
    init {
        loadData()
    }
    
    private fun loadData() {
        viewModelScope.launch {
            libraryRepository.watchlist.collectLatest { items ->
                _watchlist.value = items
            }
        }
        viewModelScope.launch {
            libraryRepository.history.collectLatest { items ->
                _history.value = items
            }
        }
        viewModelScope.launch {
            libraryRepository.recentHistory.collectLatest { items ->
                _recentHistory.value = items
            }
        }
    }
    
    fun selectTab(index: Int) {
        _selectedTab.value = index
    }
    
    fun removeFromWatchlist(id: Int) {
        viewModelScope.launch {
            libraryRepository.removeFromWatchlist(id)
        }
    }
    
    fun removeFromHistory(id: Int) {
        viewModelScope.launch {
            libraryRepository.removeFromHistory(id)
        }
    }
    
    fun clearHistory() {
        viewModelScope.launch {
            libraryRepository.clearHistory()
        }
    }
}

/**
 * Library Screen Composable
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LibraryScreen(
    onItemClick: (MediaItem) -> Unit,
    viewModel: LibraryViewModel = hiltViewModel()
) {
    val watchlist by viewModel.watchlist.collectAsState()
    val history by viewModel.history.collectAsState()
    val recentHistory by viewModel.recentHistory.collectAsState()
    val selectedTab by viewModel.selectedTab.collectAsState()
    
    val tabs = listOf("Continue Watching", "Watchlist", "History")
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(VeStreamColors.BgMain)
    ) {
        // Header
        Text(
            text = "My Library",
            color = VeStreamColors.TextPrimary,
            fontSize = 28.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 20.dp)
        )
        
        // Tabs
        ScrollableTabRow(
            selectedTabIndex = selectedTab,
            containerColor = VeStreamColors.BgMain,
            contentColor = VeStreamColors.JunglePrimary,
            edgePadding = 16.dp,
            indicator = { tabPositions ->
                TabRowDefaults.Indicator(
                    Modifier.tabIndicatorOffset(tabPositions[selectedTab]),
                    color = VeStreamColors.JunglePrimary
                )
            }
        ) {
            tabs.forEachIndexed { index, title ->
                Tab(
                    selected = selectedTab == index,
                    onClick = { viewModel.selectTab(index) },
                    text = {
                        Text(
                            text = title,
                            fontWeight = if (selectedTab == index) FontWeight.Bold else FontWeight.Normal,
                            color = if (selectedTab == index) 
                                VeStreamColors.JunglePrimary 
                            else 
                                VeStreamColors.TextSecondary
                        )
                    }
                )
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Content based on selected tab
        when (selectedTab) {
            0 -> ContinueWatchingTab(recentHistory, onItemClick)
            1 -> WatchlistTab(watchlist, onItemClick, viewModel)
            2 -> HistoryTab(history, onItemClick, viewModel)
        }
    }
}

@Composable
private fun ContinueWatchingTab(
    items: List<HistoryItem>,
    onItemClick: (MediaItem) -> Unit
) {
    if (items.isEmpty()) {
        EmptyState(
            icon = Icons.Default.PlayCircle,
            message = "Start watching to see your progress here"
        )
    } else {
        LazyColumn(
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(items.size) { index ->
                val item = items[index]
                ContinueWatchingCard(
                    item = item,
                    onClick = { onItemClick(item.toMediaItem()) }
                )
            }
        }
    }
}

@Composable
private fun WatchlistTab(
    items: List<MediaItem>,
    onItemClick: (MediaItem) -> Unit,
    viewModel: LibraryViewModel
) {
    if (items.isEmpty()) {
        EmptyState(
            icon = Icons.Default.BookmarkBorder,
            message = "Add movies and shows to your watchlist"
        )
    } else {
        LazyVerticalGrid(
            columns = GridCells.Fixed(3),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            contentPadding = PaddingValues(16.dp)
        ) {
            items(items) { item ->
                MovieCard(
                    item = item,
                    onClick = { onItemClick(item) }
                )
            }
        }
    }
}

@Composable
private fun HistoryTab(
    items: List<MediaItem>,
    onItemClick: (MediaItem) -> Unit,
    viewModel: LibraryViewModel
) {
    Column {
        // Clear History Button
        if (items.isNotEmpty()) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.End
            ) {
                TextButton(
                    onClick = { viewModel.clearHistory() },
                    colors = ButtonDefaults.textButtonColors(
                        contentColor = VeStreamColors.Error
                    )
                ) {
                    Icon(
                        imageVector = Icons.Default.Delete,
                        contentDescription = null,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Clear History")
                }
            }
        }
        
        if (items.isEmpty()) {
            EmptyState(
                icon = Icons.Default.History,
                message = "Your watch history will appear here"
            )
        } else {
            LazyVerticalGrid(
                columns = GridCells.Fixed(3),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                contentPadding = PaddingValues(16.dp)
            ) {
                items(items) { item ->
                    MovieCard(
                        item = item,
                        onClick = { onItemClick(item) }
                    )
                }
            }
        }
    }
}

@Composable
private fun ContinueWatchingCard(
    item: HistoryItem,
    onClick: () -> Unit
) {
    Card(
        onClick = onClick,
        modifier = Modifier
            .fillMaxWidth()
            .height(100.dp),
        colors = CardDefaults.cardColors(
            containerColor = VeStreamColors.BgCard
        ),
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(modifier = Modifier.fillMaxSize()) {
            // Poster
            coil.compose.AsyncImage(
                model = item.posterPath ?: item.giftedCover,
                contentDescription = item.title,
                modifier = Modifier
                    .width(70.dp)
                    .fillMaxHeight(),
                contentScale = androidx.compose.ui.layout.ContentScale.Crop
            )
            
            // Info
            Column(
                modifier = Modifier
                    .weight(1f)
                    .padding(12.dp),
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = item.title,
                    color = VeStreamColors.TextPrimary,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    maxLines = 2
                )
                
                // Progress bar
                Column {
                    LinearProgressIndicator(
                        progress = { item.progressPercent / 100f },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(4.dp),
                        color = VeStreamColors.JunglePrimary,
                        trackColor = VeStreamColors.Border
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "${item.progressPercent.toInt()}% watched",
                        color = VeStreamColors.TextDim,
                        fontSize = 11.sp
                    )
                }
            }
            
            // Play button
            Box(
                modifier = Modifier
                    .fillMaxHeight()
                    .padding(12.dp),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.PlayCircle,
                    contentDescription = "Resume",
                    tint = VeStreamColors.JunglePrimary,
                    modifier = Modifier.size(40.dp)
                )
            }
        }
    }
}

@Composable
private fun EmptyState(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    message: String
) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = VeStreamColors.TextDim,
                modifier = Modifier.size(64.dp)
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = message,
                color = VeStreamColors.TextSecondary,
                fontSize = 14.sp
            )
        }
    }
}
