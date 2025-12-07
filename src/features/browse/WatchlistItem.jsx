'use client';

import React from 'react';
import MovieCard from './MovieCard'; // MovieCard is a Server Component
import RemoveFromWatchlistButton from './RemoveFromWatchlistButton'; // Client Component

const WatchlistItem = ({ movie }) => {
  return (
    <div className="relative group">
      {/* MovieCard is rendered as a Server Component */}
      <MovieCard movie={movie} />
      <RemoveFromWatchlistButton movie={movie} />
    </div>
  );
};

export default WatchlistItem;