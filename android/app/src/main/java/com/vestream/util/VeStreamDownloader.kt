package com.vestream.util

import android.app.DownloadManager
import android.content.Context
import android.net.Uri
import android.os.Environment
import android.widget.Toast
import java.io.File

/**
 * Download Manager for VeStream
 * Downloads videos to Downloads/VeStream folder
 */
object VeStreamDownloader {
    
    private const val DOWNLOAD_FOLDER = "VeStream"
    
    /**
     * Download a video to Downloads/VeStream
     */
    fun downloadVideo(
        context: Context,
        url: String,
        title: String,
        quality: String? = null
    ) {
        try {
            // Create VeStream folder in Downloads
            val veStreamDir = File(
                Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS),
                DOWNLOAD_FOLDER
            )
            if (!veStreamDir.exists()) {
                veStreamDir.mkdirs()
            }
            
            // Generate filename
            val sanitizedTitle = title.replace(Regex("[^a-zA-Z0-9\\s]"), "").take(50)
            val qualitySuffix = quality?.let { "_$it" } ?: ""
            val timestamp = System.currentTimeMillis()
            val fileName = "${sanitizedTitle}${qualitySuffix}_$timestamp.mp4"
            
            // Create download request
            val request = DownloadManager.Request(Uri.parse(url)).apply {
                setTitle("VeStream: $title")
                setDescription("Downloading ${quality ?: "video"}...")
                setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                setDestinationInExternalPublicDir(
                    Environment.DIRECTORY_DOWNLOADS,
                    "$DOWNLOAD_FOLDER/$fileName"
                )
                setAllowedOverMetered(true)
                setAllowedOverRoaming(false)
            }
            
            // Start download
            val downloadManager = context.getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
            val downloadId = downloadManager.enqueue(request)
            
            Toast.makeText(
                context,
                "Download started: $title",
                Toast.LENGTH_SHORT
            ).show()
            
        } catch (e: Exception) {
            Toast.makeText(
                context,
                "Download failed: ${e.message}",
                Toast.LENGTH_LONG
            ).show()
        }
    }
    
    /**
     * Download a screenshot to Downloads/VeStream/Screenshots
     */
    fun saveScreenshot(
        context: Context,
        bitmap: android.graphics.Bitmap,
        title: String
    ): Boolean {
        return try {
            val screenshotsDir = File(
                Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS),
                "$DOWNLOAD_FOLDER/Screenshots"
            )
            if (!screenshotsDir.exists()) {
                screenshotsDir.mkdirs()
            }
            
            val sanitizedTitle = title.replace(Regex("[^a-zA-Z0-9\\s]"), "").take(30)
            val timestamp = System.currentTimeMillis()
            val fileName = "Screenshot_${sanitizedTitle}_$timestamp.png"
            
            val file = File(screenshotsDir, fileName)
            file.outputStream().use { out ->
                bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, out)
            }
            
            // Notify media scanner
            android.media.MediaScannerConnection.scanFile(
                context,
                arrayOf(file.absolutePath),
                arrayOf("image/png"),
                null
            )
            
            Toast.makeText(
                context,
                "Screenshot saved to Downloads/VeStream/Screenshots",
                Toast.LENGTH_SHORT
            ).show()
            
            true
        } catch (e: Exception) {
            Toast.makeText(
                context,
                "Failed to save screenshot: ${e.message}",
                Toast.LENGTH_LONG
            ).show()
            false
        }
    }
}
