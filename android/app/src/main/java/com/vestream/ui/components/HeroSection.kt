package com.vestream.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.vestream.data.model.MediaItem
import com.vestream.ui.theme.VeStreamColors

/**
 * Hero Section for Homepage
 */
@Composable
fun HeroSection(
    item: MediaItem?,
    onPlayClick: () -> Unit,
    onAddToListClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    if (item == null) {
        // Loading placeholder
        Box(
            modifier = modifier
                .fillMaxWidth()
                .height(450.dp)
                .background(VeStreamColors.BgSurface)
        )
        return
    }
    
    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(450.dp)
    ) {
        // Background Image
        AsyncImage(
            model = item.backdropUrl ?: item.posterUrl,
            contentDescription = item.displayTitle,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize()
        )
        
        // Gradient Overlays
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            Color.Transparent,
                            VeStreamColors.BgMain.copy(alpha = 0.6f),
                            VeStreamColors.BgMain
                        )
                    )
                )
        )
        
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.horizontalGradient(
                        colors = listOf(
                            VeStreamColors.BgMain.copy(alpha = 0.8f),
                            Color.Transparent
                        )
                    )
                )
        )
        
        // Content
        Column(
            modifier = Modifier
                .align(Alignment.BottomStart)
                .padding(24.dp)
                .fillMaxWidth(0.7f)
        ) {
            // Trending Badge
            Surface(
                color = VeStreamColors.TextPrimary,
                shape = RoundedCornerShape(4.dp)
            ) {
                Text(
                    text = "#1 TRENDING",
                    color = VeStreamColors.BgMain,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.ExtraBold,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                )
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            
            // Title
            Text(
                text = item.displayTitle,
                color = VeStreamColors.TextPrimary,
                fontSize = 28.sp,
                fontWeight = FontWeight.Bold,
                lineHeight = 34.sp
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            // Overview
            Text(
                text = item.overview ?: "",
                color = VeStreamColors.TextSecondary,
                fontSize = 14.sp,
                maxLines = 3,
                lineHeight = 20.sp
            )
            
            Spacer(modifier = Modifier.height(20.dp))
            
            // Action Buttons
            Row(
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Play Button
                Button(
                    onClick = onPlayClick,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = VeStreamColors.JunglePrimary
                    ),
                    shape = RoundedCornerShape(8.dp),
                    contentPadding = PaddingValues(horizontal = 20.dp, vertical = 12.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.PlayArrow,
                        contentDescription = null,
                        tint = VeStreamColors.BgMain
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Watch Now",
                        color = VeStreamColors.BgMain,
                        fontWeight = FontWeight.Bold
                    )
                }
                
                // My List Button
                OutlinedButton(
                    onClick = onAddToListClick,
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.outlinedButtonColors(
                        contentColor = VeStreamColors.TextPrimary
                    ),
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 12.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Add,
                        contentDescription = null
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "My List",
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }
    }
}
