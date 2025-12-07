'use client';

import React from 'react';
import { XCircle } from 'lucide-react';
import { useWatchlistStore } from '@/hooks/useWatchlistStore';
import { Button } from '@/components/ui/Button';

const RemoveFromWatchlistButton = ({ movie }) => {
  const { toggleWatchlist } = useWatchlistStore();

  const handleRemove = (e) => {
    e.preventDefault(); // Prevent navigating to the watch page
    e.stopPropagation(); // Prevent triggering parent Link
    toggleWatchlist(movie);
  };

  return (
    <Button variant="destructive" size="icon" className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleRemove}>
      <XCircle className="h-5 w-5" />
    </Button>
  );
};

export default RemoveFromWatchlistButton;