'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Check } from 'lucide-react';
import { useWatchlistStore } from '@/hooks/useWatchlistStore';
import { Button } from '@/components/ui/Button';

const WatchlistButton = ({ movie, ...props }) => {
  const { watchlist, toggleWatchlist } = useWatchlistStore();
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    setIsInWatchlist(watchlist.some((item) => item.id === movie.id));
  }, [watchlist, movie.id]);

  return (
    <Button {...props} onClick={() => toggleWatchlist(movie)}>
      {isInWatchlist ? <Check className="mr-2 h-5 w-5" /> : <Plus className="mr-2 h-5 w-5" />}
      My List
    </Button>
  );
};

export default WatchlistButton;