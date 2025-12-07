package com.vestream

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.List
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.vestream.ui.navigation.Screen
import com.vestream.ui.navigation.VeStreamNavGraph
import com.vestream.ui.theme.VeStreamColors
import com.vestream.ui.theme.VeStreamTheme
import dagger.hilt.android.AndroidEntryPoint

data class BottomNavItem(
    val route: String,
    val title: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector
)

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    
    private val bottomNavItems = listOf(
        BottomNavItem(
            route = Screen.Home.route,
            title = "Home",
            selectedIcon = Icons.Filled.Home,
            unselectedIcon = Icons.Outlined.Home
        ),
        BottomNavItem(
            route = Screen.Search.route,
            title = "Search",
            selectedIcon = Icons.Filled.Search,
            unselectedIcon = Icons.Outlined.Search
        ),
        BottomNavItem(
            route = Screen.Library.route,
            title = "Library",
            selectedIcon = Icons.Filled.List,
            unselectedIcon = Icons.Outlined.List
        )
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        setContent {
            VeStreamTheme {
                val navController = rememberNavController()
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentRoute = navBackStackEntry?.destination?.route
                
                // Hide bottom nav on Watch screen
                val showBottomNav = currentRoute?.startsWith("watch") != true
                
                Scaffold(
                    containerColor = VeStreamColors.BgMain,
                    bottomBar = {
                        if (showBottomNav) {
                            NavigationBar(
                                containerColor = VeStreamColors.BgSurface,
                                contentColor = VeStreamColors.TextPrimary
                            ) {
                                bottomNavItems.forEach { item ->
                                    val selected = currentRoute == item.route
                                    NavigationBarItem(
                                        selected = selected,
                                        onClick = {
                                            if (currentRoute != item.route) {
                                                navController.navigate(item.route) {
                                                    popUpTo(Screen.Home.route)
                                                    launchSingleTop = true
                                                }
                                            }
                                        },
                                        icon = {
                                            Icon(
                                                imageVector = if (selected) item.selectedIcon else item.unselectedIcon,
                                                contentDescription = item.title
                                            )
                                        },
                                        label = { Text(item.title) },
                                        colors = NavigationBarItemDefaults.colors(
                                            selectedIconColor = VeStreamColors.JunglePrimary,
                                            selectedTextColor = VeStreamColors.JunglePrimary,
                                            unselectedIconColor = VeStreamColors.TextSecondary,
                                            unselectedTextColor = VeStreamColors.TextSecondary,
                                            indicatorColor = VeStreamColors.JunglePrimary.copy(alpha = 0.1f)
                                        )
                                    )
                                }
                            }
                        }
                    }
                ) { paddingValues ->
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(paddingValues)
                            .background(VeStreamColors.BgMain)
                    ) {
                        VeStreamNavGraph(navController = navController)
                    }
                }
            }
        }
    }
}
