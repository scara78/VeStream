package com.vestream.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.vestream.data.model.MediaItem
import com.vestream.data.repository.MovieRepository
import com.vestream.ui.components.MovieCard
import com.vestream.ui.theme.VeStreamColors
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * Search Screen ViewModel
 */
@HiltViewModel
class SearchViewModel @Inject constructor(
    private val repository: MovieRepository
) : ViewModel() {
    
    private val _query = MutableStateFlow("")
    val query: StateFlow<String> = _query
    
    private val _results = MutableStateFlow<List<MediaItem>>(emptyList())
    val results: StateFlow<List<MediaItem>> = _results
    
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading
    
    private var searchJob: Job? = null
    
    fun updateQuery(newQuery: String) {
        _query.value = newQuery
        
        // Debounced search
        searchJob?.cancel()
        if (newQuery.isNotBlank()) {
            searchJob = viewModelScope.launch {
                delay(300) // Debounce
                search(newQuery)
            }
        } else {
            _results.value = emptyList()
        }
    }
    
    private suspend fun search(query: String) {
        _isLoading.value = true
        
        repository.search(query).onSuccess { items ->
            _results.value = items
        }.onFailure {
            _results.value = emptyList()
        }
        
        _isLoading.value = false
    }
    
    fun clearQuery() {
        _query.value = ""
        _results.value = emptyList()
    }
}

/**
 * Search Screen Composable
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SearchScreen(
    onItemClick: (MediaItem) -> Unit,
    viewModel: SearchViewModel = hiltViewModel()
) {
    val query by viewModel.query.collectAsState()
    val results by viewModel.results.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val focusManager = LocalFocusManager.current
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(VeStreamColors.BgMain)
    ) {
        // Search Bar
        OutlinedTextField(
            value = query,
            onValueChange = { viewModel.updateQuery(it) },
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            placeholder = {
                Text(
                    "Search movies and TV shows...",
                    color = VeStreamColors.TextDim
                )
            },
            leadingIcon = {
                Icon(
                    imageVector = Icons.Default.Search,
                    contentDescription = null,
                    tint = VeStreamColors.JunglePrimary
                )
            },
            trailingIcon = {
                if (query.isNotEmpty()) {
                    IconButton(onClick = { viewModel.clearQuery() }) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Clear",
                            tint = VeStreamColors.TextSecondary
                        )
                    }
                }
            },
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = VeStreamColors.JunglePrimary,
                unfocusedBorderColor = VeStreamColors.Border,
                cursorColor = VeStreamColors.JunglePrimary,
                focusedTextColor = VeStreamColors.TextPrimary,
                unfocusedTextColor = VeStreamColors.TextPrimary
            ),
            shape = RoundedCornerShape(12.dp),
            singleLine = true,
            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
            keyboardActions = KeyboardActions(onSearch = { focusManager.clearFocus() })
        )
        
        // Results
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp)
        ) {
            when {
                isLoading -> {
                    CircularProgressIndicator(
                        modifier = Modifier.align(Alignment.Center),
                        color = VeStreamColors.JunglePrimary
                    )
                }
                query.isEmpty() -> {
                    Text(
                        text = "Search for your favorite movies and TV shows",
                        color = VeStreamColors.TextDim,
                        modifier = Modifier.align(Alignment.Center)
                    )
                }
                results.isEmpty() && query.isNotEmpty() -> {
                    Text(
                        text = "No results found for \"$query\"",
                        color = VeStreamColors.TextSecondary,
                        modifier = Modifier.align(Alignment.Center)
                    )
                }
                else -> {
                    LazyVerticalGrid(
                        columns = GridCells.Fixed(3),
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp),
                        contentPadding = PaddingValues(bottom = 80.dp)
                    ) {
                        items(results) { item ->
                            MovieCard(
                                item = item,
                                onClick = { onItemClick(item) }
                            )
                        }
                    }
                }
            }
        }
    }
}
