'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Library,
  Heart,
  Clock,
  Bookmark,
  Download,
  Trash2,
  Star,
  Play,
  X,
  Filter,
  Grid,
  List,
  Loader
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import usePreferencesStore from '@/store/usePreferences';
import { format } from 'date-fns';

/**
 * Library Page
 * User's personal collection: Continue Watching, Watch History, Liked, Saved
 */
export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState('continue');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const {
    getContinueWatching,
    removeContinueWatching,
    watchHistory,
    addToWatchHistory,
    clearWatchHistory,
    likedMovies,
    toggleLike,
    savedMovies,
    toggleSave,
    getLikedMovies,
    getSavedMovies,
  } = usePreferencesStore();

  const continueWatchingItems = getContinueWatching();
  const likedIds = getLikedMovies();
  const savedIds = getSavedMovies();

  const tabs = [
    { id: 'continue', label: 'Continue Watching', icon: Clock, count: continueWatchingItems.length },
    { id: 'history', label: 'Watch History', icon: Clock, count: watchHistory.length },
    { id: 'liked', label: 'Liked', icon: Heart, count: likedIds.length },
    { id: 'saved', label: 'My List', icon: Bookmark, count: savedIds.length },
  ];

  return (
    <div className="min-h-screen bg-black pt-20 px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Library className="w-10 h-10 text-[#00ff88]" />
            My Library
          </h1>
          <p className="text-gray-400">Your personal collection of movies and TV shows</p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                    ? 'bg-[#00ff88] text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count > 0 && (
                  <Badge className="ml-1 bg-black/20 text-white border-0">
                    {tab.count}
                  </Badge>
                )}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                  ? 'bg-[#00ff88] text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                  ? 'bg-[#00ff88] text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Continue Watching Tab */}
          {activeTab === 'continue' && (
            <div>
              {continueWatchingItems.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-400 text-sm">
                      {continueWatchingItems.length} {continueWatchingItems.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {continueWatchingItems.map((item, index) => (
                        <MediaCard key={`${item.id}-${index}`} item={item} />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {continueWatchingItems.map((item, index) => (
                        <MediaListItem key={`${item.id}-${index}`} item={item} />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <EmptyState
                  icon={Clock}
                  title="No videos in progress"
                  description="Start watching something to see it here"
                />
              )}
            </div>
          )}

          {/* Watch History Tab */}
          {activeTab === 'history' && (
            <div>
              {watchHistory.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-400 text-sm">
                      {watchHistory.length} {watchHistory.length === 1 ? 'item' : 'items'}
                    </p>
                    <Button
                      onClick={() => {
                        if (confirm('Clear all watch history? This cannot be undone.')) {
                          clearWatchHistory();
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear All
                    </Button>
                  </div>

                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {watchHistory.map((item, index) => (
                        <MediaCard key={`${item.id}-${index}`} item={item} />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {watchHistory.map((item, index) => (
                        <MediaListItem key={`${item.id}-${index}`} item={item} />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <EmptyState
                  icon={Clock}
                  title="No watch history"
                  description="Videos you watch will appear here"
                />
              )}
            </div>
          )}

          {/* Liked Tab */}
          {activeTab === 'liked' && (
            <LikedContent likedIds={likedIds} viewMode={viewMode} />
          )}

          {/* Saved/My List Tab */}
          {activeTab === 'saved' && (
            <SavedContent savedIds={savedIds} viewMode={viewMode} />
          )}
        </div>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
        <Icon className="w-10 h-10 text-gray-500" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-6">{description}</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#00ff88] text-black font-semibold hover:bg-[#00ff88]/90 transition-colors"
      >
        Browse Content
      </Link>
    </div>
  );
}

// Media Card Component (Grid View)
function MediaCard({ item }) {
  return (
    <Link href={`/watch/${item.mediaType}/${item.id}`} className="group block">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-white/5 border border-white/10 hover:border-[#00ff88]/50 transition-all hover:scale-105">
        <img
          src={
            item.posterPath
              ? `https://image.tmdb.org/t/p/w500${item.posterPath}`
              : 'https://via.placeholder.com/500x750/1a1a2e/00f0ff?text=No+Image'
          }
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-white text-sm font-semibold line-clamp-2">{item.title}</p>
            {item.watchedAt && (
              <p className="text-gray-400 text-xs mt-1">
                {format(new Date(item.watchedAt), 'MMM d, yyyy')}
              </p>
            )}
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-[#00ff88]/90 flex items-center justify-center">
            <Play className="w-6 h-6 text-black ml-0.5" fill="currentColor" />
          </div>
        </div>
      </div>
    </Link>
  );
}

// Media List Item Component (List View)
function MediaListItem({ item }) {
  return (
    <Link
      href={`/watch/${item.mediaType}/${item.id}`}
      className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00ff88]/50 transition-all group"
    >
      <img
        src={
          item.posterPath
            ? `https://image.tmdb.org/t/p/w200${item.posterPath}`
            : 'https://via.placeholder.com/200x300/1a1a2e/00f0ff?text=No+Image'
        }
        alt={item.title}
        className="w-16 h-24 object-cover rounded"
      />
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-semibold truncate">{item.title}</h3>
        <p className="text-gray-400 text-sm">{item.mediaType === 'tv' ? 'TV Show' : 'Movie'}</p>
        {item.watchedAt && (
          <p className="text-gray-500 text-xs mt-1">
            Watched {format(new Date(item.watchedAt), 'MMM d, yyyy')}
          </p>
        )}
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-10 h-10 rounded-full bg-[#00ff88]/90 flex items-center justify-center">
          <Play className="w-5 h-5 text-black ml-0.5" fill="currentColor" />
        </div>
      </div>
    </Link>
  );
}

// Liked Content Component
function LikedContent({ likedIds, viewMode }) {
  const [content, setContent] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { toggleLike } = usePreferencesStore();

  React.useEffect(() => {
    const fetchLikedContent = async () => {
      if (likedIds.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Parse IDs (format: "type_id" e.g., "movie_550" or "tv_1399")
        const items = await Promise.all(
          likedIds.map(async (likedId) => {
            const [type, id] = likedId.split('_');
            try {
              const { getTMDBDetails, formatTMDBData } = await import('@/services/movieApi');
              const details = await getTMDBDetails(parseInt(id), type);
              return formatTMDBData({ ...details, media_type: type });
            } catch (err) {
              console.error(`Error fetching ${likedId}:`, err);
              return null;
            }
          })
        );
        setContent(items.filter(Boolean));
      } catch (err) {
        console.error('Error fetching liked content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedContent();
  }, [likedIds]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-10 h-10 animate-spin text-[#00ff88]" />
      </div>
    );
  }

  if (likedIds.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="No liked content"
        description="Like movies and shows to save them here"
      />
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-400 text-sm">
          {content.length} {content.length === 1 ? 'item' : 'items'} liked
        </p>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {content.map((item) => (
            <FavoritesCard key={item.id} item={item} onRemove={() => toggleLike(`${item.type}_${item.id}`)} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {content.map((item) => (
            <FavoritesListItem key={item.id} item={item} onRemove={() => toggleLike(`${item.type}_${item.id}`)} />
          ))}
        </div>
      )}
    </>
  );
}

// Saved Content Component
function SavedContent({ savedIds, viewMode }) {
  const [content, setContent] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { toggleSave } = usePreferencesStore();

  React.useEffect(() => {
    const fetchSavedContent = async () => {
      if (savedIds.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const items = await Promise.all(
          savedIds.map(async (savedId) => {
            const [type, id] = savedId.split('_');
            try {
              const { getTMDBDetails, formatTMDBData } = await import('@/services/movieApi');
              const details = await getTMDBDetails(parseInt(id), type);
              return formatTMDBData({ ...details, media_type: type });
            } catch (err) {
              console.error(`Error fetching ${savedId}:`, err);
              return null;
            }
          })
        );
        setContent(items.filter(Boolean));
      } catch (err) {
        console.error('Error fetching saved content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedContent();
  }, [savedIds]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-10 h-10 animate-spin text-[#00ff88]" />
      </div>
    );
  }

  if (savedIds.length === 0) {
    return (
      <EmptyState
        icon={Bookmark}
        title="Your list is empty"
        description="Add movies and shows to your list to watch later"
      />
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-400 text-sm">
          {content.length} {content.length === 1 ? 'item' : 'items'} in your list
        </p>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {content.map((item) => (
            <FavoritesCard key={item.id} item={item} onRemove={() => toggleSave(`${item.type}_${item.id}`)} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {content.map((item) => (
            <FavoritesListItem key={item.id} item={item} onRemove={() => toggleSave(`${item.type}_${item.id}`)} />
          ))}
        </div>
      )}
    </>
  );
}

// Favorites Card (Grid View with remove button)
function FavoritesCard({ item, onRemove }) {
  return (
    <div className="group relative">
      <Link href={`/watch/${item.type}/${item.id}`} className="block">
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-white/5 border border-white/10 hover:border-[#00ff88]/50 transition-all hover:scale-105">
          <img
            src={item.poster || 'https://via.placeholder.com/500x750/1a1a2e/00f0ff?text=No+Image'}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-white text-sm font-semibold line-clamp-2">{item.title}</p>
              {item.rating && (
                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-3 h-3 text-[#00ff88] fill-current" />
                  <span className="text-white text-xs">{item.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-[#00ff88]/90 flex items-center justify-center">
              <Play className="w-6 h-6 text-black ml-0.5" fill="currentColor" />
            </div>
          </div>
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          if (confirm('Remove from your list?')) {
            onRemove();
          }
        }}
        className="absolute top-2 right-2 p-2 rounded-full bg-black/80 backdrop-blur-sm border border-white/10 text-white hover:bg-red-500/80 hover:border-red-500 transition-all opacity-0 group-hover:opacity-100 z-10"
        aria-label="Remove from list"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Favorites List Item (List View with remove button)
function FavoritesListItem({ item, onRemove }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00ff88]/50 transition-all group">
      <Link href={`/watch/${item.type}/${item.id}`} className="flex items-center gap-4 flex-1 min-w-0">
        <img
          src={item.poster || 'https://via.placeholder.com/200x300/1a1a2e/00f0ff?text=No+Image'}
          alt={item.title}
          className="w-16 h-24 object-cover rounded"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold truncate">{item.title}</h3>
          <p className="text-gray-400 text-sm">{item.type === 'tv' ? 'TV Show' : 'Movie'}</p>
          {item.year && <p className="text-gray-500 text-xs mt-1">{item.year}</p>}
        </div>
        {item.rating && (
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-[#00ff88] fill-current" />
            <span className="text-white text-sm font-bold">{item.rating.toFixed(1)}</span>
          </div>
        )}
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          if (confirm('Remove from your list?')) {
            onRemove();
          }
        }}
        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
        aria-label="Remove from list"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
