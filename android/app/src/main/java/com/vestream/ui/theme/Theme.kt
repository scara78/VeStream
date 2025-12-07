package com.vestream.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val VeStreamColorScheme = darkColorScheme(
    primary = VeStreamColors.JunglePrimary,
    secondary = VeStreamColors.JungleSecondary,
    tertiary = VeStreamColors.JungleDark,
    background = VeStreamColors.BgMain,
    surface = VeStreamColors.BgSurface,
    surfaceVariant = VeStreamColors.BgCard,
    onPrimary = VeStreamColors.BgMain,
    onSecondary = VeStreamColors.TextPrimary,
    onTertiary = VeStreamColors.TextPrimary,
    onBackground = VeStreamColors.TextPrimary,
    onSurface = VeStreamColors.TextPrimary,
    onSurfaceVariant = VeStreamColors.TextSecondary,
    error = VeStreamColors.Error,
    onError = VeStreamColors.TextPrimary,
    outline = VeStreamColors.Border
)

@Composable
fun VeStreamTheme(
    content: @Composable () -> Unit
) {
    val colorScheme = VeStreamColorScheme
    val view = LocalView.current
    
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.background.toArgb()
            window.navigationBarColor = colorScheme.background.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = VeStreamTypography,
        content = content
    )
}
