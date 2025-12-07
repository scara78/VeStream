package com.vestream.ui.components

import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.annotation.OptIn
import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.media3.common.MediaItem
import androidx.media3.common.Player
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.ui.AspectRatioFrameLayout
import androidx.media3.ui.PlayerView
import com.vestream.data.model.GiftedDownloadSource
import com.vestream.ui.theme.VeStreamColors
import kotlinx.coroutines.delay

/**
 * Custom Video Player with VeStream-styled controls
 * Matching the web app's design
 */
@OptIn(UnstableApi::class)
@Composable
fun VeStreamPlayer(
    videoUrl: String?,
    sources: List<GiftedDownloadSource>,
    selectedQuality: String?,
    onQualityChange: (String) -> Unit,
    onBackClick: () -> Unit,
    title: String = "",
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    
    // Player state
    var isPlaying by remember { mutableStateOf(false) }
    var currentTime by remember { mutableStateOf(0L) }
    var duration by remember { mutableStateOf(0L) }
    var bufferedPosition by remember { mutableStateOf(0L) }
    var showControls by remember { mutableStateOf(true) }
    var showSettings by remember { mutableStateOf(false) }
    var settingsTab by remember { mutableStateOf("quality") } // "quality" or "speed"
    var playbackSpeed by remember { mutableStateOf(1f) }
    var isMuted by remember { mutableStateOf(false) }
    var volume by remember { mutableStateOf(1f) }
    var showDoubleTapSeek by remember { mutableStateOf<String?>(null) } // "left" or "right"
    
    val speedOptions = listOf(0.5f, 0.75f, 1f, 1.25f, 1.5f, 2f)
    
    // Initialize ExoPlayer
    val player = remember {
        ExoPlayer.Builder(context).build().apply {
            playWhenReady = true
        }
    }
    
    // Auto-hide controls
    LaunchedEffect(showControls, isPlaying) {
        if (showControls && isPlaying) {
            delay(3000)
            showControls = false
        }
    }
    
    // Update player source
    LaunchedEffect(videoUrl) {
        videoUrl?.let { url ->
            player.setMediaItem(MediaItem.fromUri(url))
            player.prepare()
        }
    }
    
    // Track player state
    DisposableEffect(player) {
        val listener = object : Player.Listener {
            override fun onIsPlayingChanged(playing: Boolean) {
                isPlaying = playing
            }
            override fun onPlaybackStateChanged(state: Int) {
                duration = player.duration.coerceAtLeast(0L)
            }
        }
        player.addListener(listener)
        
        onDispose {
            player.removeListener(listener)
            player.release()
        }
    }
    
    // Update time periodically
    LaunchedEffect(isPlaying) {
        while (true) {
            currentTime = player.currentPosition.coerceAtLeast(0L)
            bufferedPosition = player.bufferedPosition.coerceAtLeast(0L)
            delay(500)
        }
    }
    
    // Double-tap seek handler
    fun handleDoubleTap(isLeft: Boolean) {
        val seekAmount = if (isLeft) -10000L else 10000L
        player.seekTo((player.currentPosition + seekAmount).coerceIn(0, player.duration))
        showDoubleTapSeek = if (isLeft) "left" else "right"
    }
    
    // Hide double-tap indicator
    LaunchedEffect(showDoubleTapSeek) {
        if (showDoubleTapSeek != null) {
            delay(500)
            showDoubleTapSeek = null
        }
    }
    
    Box(
        modifier = modifier
            .fillMaxWidth()
            .aspectRatio(16f / 9f)
            .background(Color.Black)
            .pointerInput(Unit) {
                detectTapGestures(
                    onTap = { showControls = !showControls },
                    onDoubleTap = { offset ->
                        val isLeft = offset.x < size.width / 2
                        handleDoubleTap(isLeft)
                    }
                )
            }
    ) {
        // Video Surface
        AndroidView(
            factory = { ctx ->
                PlayerView(ctx).apply {
                    this.player = player
                    useController = false // We use custom controls
                    resizeMode = AspectRatioFrameLayout.RESIZE_MODE_FIT
                    layoutParams = FrameLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.MATCH_PARENT
                    )
                }
            },
            modifier = Modifier.fillMaxSize()
        )
        
        // Double-Tap Seek Indicator
        AnimatedVisibility(
            visible = showDoubleTapSeek != null,
            enter = fadeIn(),
            exit = fadeOut(),
            modifier = Modifier.align(
                if (showDoubleTapSeek == "left") Alignment.CenterStart else Alignment.CenterEnd
            )
        ) {
            Box(
                modifier = Modifier
                    .width(120.dp)
                    .fillMaxHeight(),
                contentAlignment = Alignment.Center
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = if (showDoubleTapSeek == "left") "⏪" else "⏩",
                        fontSize = 36.sp
                    )
                    Text(
                        text = "10 sec",
                        color = VeStreamColors.JunglePrimary,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
        
        // Controls Overlay
        AnimatedVisibility(
            visible = showControls,
            enter = fadeIn(),
            exit = fadeOut()
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(
                                Color.Black.copy(alpha = 0.7f),
                                Color.Transparent,
                                Color.Transparent,
                                Color.Black.copy(alpha = 0.8f)
                            )
                        )
                    )
            ) {
                // Top Bar
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                        .align(Alignment.TopStart),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Back Button
                    IconButton(
                        onClick = onBackClick,
                        modifier = Modifier
                            .size(40.dp)
                            .background(Color.Black.copy(alpha = 0.5f), CircleShape)
                    ) {
                        Icon(
                            imageVector = Icons.Default.ArrowBack,
                            contentDescription = "Back",
                            tint = Color.White
                        )
                    }
                    
                    Spacer(modifier = Modifier.width(12.dp))
                    
                    // Title
                    Text(
                        text = title,
                        color = Color.White,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.SemiBold,
                        maxLines = 1
                    )
                }
                
                // Center Play/Pause Button
                Box(
                    modifier = Modifier
                        .align(Alignment.Center)
                        .size(72.dp)
                        .clip(CircleShape)
                        .background(VeStreamColors.JunglePrimary.copy(alpha = 0.9f))
                        .clickable {
                            if (isPlaying) player.pause() else player.play()
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = if (isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                        contentDescription = if (isPlaying) "Pause" else "Play",
                        tint = VeStreamColors.BgMain,
                        modifier = Modifier.size(40.dp)
                    )
                }
                
                // Skip Buttons
                Row(
                    modifier = Modifier.align(Alignment.Center),
                    horizontalArrangement = Arrangement.spacedBy(100.dp)
                ) {
                    // Skip Back
                    IconButton(
                        onClick = { player.seekTo(player.currentPosition - 10000) },
                        modifier = Modifier
                            .size(48.dp)
                            .background(Color.Black.copy(alpha = 0.4f), CircleShape)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Replay10,
                            contentDescription = "-10s",
                            tint = Color.White,
                            modifier = Modifier.size(28.dp)
                        )
                    }
                    
                    Spacer(modifier = Modifier.width(60.dp))
                    
                    // Skip Forward
                    IconButton(
                        onClick = { player.seekTo(player.currentPosition + 10000) },
                        modifier = Modifier
                            .size(48.dp)
                            .background(Color.Black.copy(alpha = 0.4f), CircleShape)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Forward10,
                            contentDescription = "+10s",
                            tint = Color.White,
                            modifier = Modifier.size(28.dp)
                        )
                    }
                }
                
                // Bottom Controls
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .align(Alignment.BottomStart)
                        .padding(16.dp)
                ) {
                    // Progress Bar
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = formatTime(currentTime),
                            color = Color.White,
                            fontSize = 12.sp
                        )
                        
                        Slider(
                            value = if (duration > 0) currentTime.toFloat() / duration.toFloat() else 0f,
                            onValueChange = { progress ->
                                player.seekTo((progress * duration).toLong())
                            },
                            modifier = Modifier
                                .weight(1f)
                                .padding(horizontal = 8.dp),
                            colors = SliderDefaults.colors(
                                thumbColor = VeStreamColors.JunglePrimary,
                                activeTrackColor = VeStreamColors.JunglePrimary,
                                inactiveTrackColor = Color.White.copy(alpha = 0.3f)
                            )
                        )
                        
                        Text(
                            text = formatTime(duration),
                            color = Color.White,
                            fontSize = 12.sp
                        )
                    }
                    
                    Spacer(modifier = Modifier.height(8.dp))
                    
                    // Bottom Control Buttons
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Left: Volume
                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            IconButton(
                                onClick = {
                                    isMuted = !isMuted
                                    player.volume = if (isMuted) 0f else volume
                                }
                            ) {
                                Icon(
                                    imageVector = if (isMuted) Icons.Default.VolumeOff else Icons.Default.VolumeUp,
                                    contentDescription = "Volume",
                                    tint = if (isMuted) Color.Red.copy(alpha = 0.8f) else VeStreamColors.JunglePrimary
                                )
                            }
                        }
                        
                        // Right: Download, Screenshot, Settings, Fullscreen
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            // Download
                            IconButton(
                                onClick = {
                                    videoUrl?.let { url ->
                                        com.vestream.util.VeStreamDownloader.downloadVideo(
                                            context = context,
                                            url = url,
                                            title = title,
                                            quality = selectedQuality
                                        )
                                    }
                                }
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Download,
                                    contentDescription = "Download",
                                    tint = Color.White
                                )
                            }
                            
                            // Settings
                            Box {
                                IconButton(
                                    onClick = { showSettings = !showSettings }
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Settings,
                                        contentDescription = "Settings",
                                        tint = Color.White
                                    )
                                }
                                
                                // Settings Dropdown
                                DropdownMenu(
                                    expanded = showSettings,
                                    onDismissRequest = { showSettings = false },
                                    modifier = Modifier
                                        .background(VeStreamColors.BgSurface)
                                        .width(200.dp)
                                ) {
                                    // Tabs
                                    Row(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(8.dp)
                                    ) {
                                        TextButton(
                                            onClick = { settingsTab = "quality" },
                                            colors = ButtonDefaults.textButtonColors(
                                                contentColor = if (settingsTab == "quality") 
                                                    VeStreamColors.JunglePrimary 
                                                else 
                                                    VeStreamColors.TextSecondary
                                            )
                                        ) {
                                            Text("Quality", fontWeight = FontWeight.Bold)
                                        }
                                        TextButton(
                                            onClick = { settingsTab = "speed" },
                                            colors = ButtonDefaults.textButtonColors(
                                                contentColor = if (settingsTab == "speed") 
                                                    VeStreamColors.JunglePrimary 
                                                else 
                                                    VeStreamColors.TextSecondary
                                            )
                                        ) {
                                            Text("Speed", fontWeight = FontWeight.Bold)
                                        }
                                    }
                                    
                                    Divider(color = VeStreamColors.Border)
                                    
                                    // Quality Options
                                    if (settingsTab == "quality") {
                                        sources.forEach { source ->
                                            DropdownMenuItem(
                                                text = {
                                                    Row(
                                                        modifier = Modifier.fillMaxWidth(),
                                                        horizontalArrangement = Arrangement.SpaceBetween
                                                    ) {
                                                        Text(
                                                            source.quality,
                                                            color = if (selectedQuality == source.quality)
                                                                VeStreamColors.JunglePrimary
                                                            else
                                                                VeStreamColors.TextPrimary
                                                        )
                                                        if (selectedQuality == source.quality) {
                                                            Icon(
                                                                Icons.Default.Check,
                                                                contentDescription = null,
                                                                tint = VeStreamColors.JunglePrimary,
                                                                modifier = Modifier.size(16.dp)
                                                            )
                                                        }
                                                    }
                                                },
                                                onClick = {
                                                    onQualityChange(source.quality)
                                                    showSettings = false
                                                }
                                            )
                                        }
                                    }
                                    
                                    // Speed Options
                                    if (settingsTab == "speed") {
                                        speedOptions.forEach { speed ->
                                            DropdownMenuItem(
                                                text = {
                                                    Row(
                                                        modifier = Modifier.fillMaxWidth(),
                                                        horizontalArrangement = Arrangement.SpaceBetween
                                                    ) {
                                                        Text(
                                                            "${speed}x",
                                                            color = if (playbackSpeed == speed)
                                                                VeStreamColors.JunglePrimary
                                                            else
                                                                VeStreamColors.TextPrimary
                                                        )
                                                        if (playbackSpeed == speed) {
                                                            Icon(
                                                                Icons.Default.Check,
                                                                contentDescription = null,
                                                                tint = VeStreamColors.JunglePrimary,
                                                                modifier = Modifier.size(16.dp)
                                                            )
                                                        }
                                                    }
                                                },
                                                onClick = {
                                                    playbackSpeed = speed
                                                    player.setPlaybackSpeed(speed)
                                                    showSettings = false
                                                }
                                            )
                                        }
                                    }
                                }
                            }
                            
                            // Fullscreen
                            IconButton(onClick = { /* TODO: Fullscreen */ }) {
                                Icon(
                                    imageVector = Icons.Default.Fullscreen,
                                    contentDescription = "Fullscreen",
                                    tint = VeStreamColors.JunglePrimary
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

/**
 * Format milliseconds to MM:SS
 */
private fun formatTime(millis: Long): String {
    val totalSeconds = millis / 1000
    val minutes = totalSeconds / 60
    val seconds = totalSeconds % 60
    return String.format("%02d:%02d", minutes, seconds)
}
