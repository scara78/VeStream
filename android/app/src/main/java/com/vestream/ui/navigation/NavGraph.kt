package com.vestream.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.vestream.data.model.MediaItem
import com.vestream.ui.screens.HomeScreen
import com.vestream.ui.screens.LibraryScreen
import com.vestream.ui.screens.SearchScreen
import com.vestream.ui.screens.WatchScreen

/**
 * Navigation Routes
 */
sealed class Screen(val route: String) {
    object Home : Screen("home")
    object Search : Screen("search")
    object Library : Screen("library")
    object Watch : Screen("watch/{id}/{type}") {
        fun createRoute(id: Int, type: String) = "watch/$id/$type"
    }
}

/**
 * Main Navigation Graph
 */
@Composable
fun VeStreamNavGraph(
    navController: NavHostController,
    startDestination: String = Screen.Home.route
) {
    // Store selected media item temporarily
    val selectedItem = remember { mutableListOf<MediaItem>() }
    
    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        composable(Screen.Home.route) {
            HomeScreen(
                onItemClick = { item ->
                    selectedItem.clear()
                    selectedItem.add(item)
                    navController.navigate(Screen.Watch.createRoute(item.id, item.displayType))
                }
            )
        }
        
        composable(Screen.Search.route) {
            SearchScreen(
                onItemClick = { item ->
                    selectedItem.clear()
                    selectedItem.add(item)
                    navController.navigate(Screen.Watch.createRoute(item.id, item.displayType))
                }
            )
        }
        
        composable(Screen.Library.route) {
            LibraryScreen(
                onItemClick = { item ->
                    selectedItem.clear()
                    selectedItem.add(item)
                    navController.navigate(Screen.Watch.createRoute(item.id, item.displayType))
                }
            )
        }
        
        composable(Screen.Watch.route) {
            selectedItem.firstOrNull()?.let { item ->
                WatchScreen(
                    mediaItem = item,
                    onBackClick = { navController.popBackStack() }
                )
            }
        }
    }
}
