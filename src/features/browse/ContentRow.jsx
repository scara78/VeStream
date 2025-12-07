'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from '@/components/MovieCard';
import { Button } from '@/components/ui/Button';

// This is now a Client Component that receives movie data as a prop.
const ContentRow = ({ title, movies = [], isLarge = false, localData = [] }) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  if (movies.length === 0) {
    return null; // Don't render the row if there's no data
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Re-check scroll state if movies or localData changes
    // This ensures arrows are correctly displayed for dynamically loaded localData
    handleScroll();
  }, [movies]);

  return (
    <div className="mb-8 group relative">
      <h2 className="text-xl font-bold mb-4 px-4 md:px-8">{title}</h2>
      {showLeftArrow && (
        <Button variant="ghost" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2 h-full w-12 rounded-none bg-gradient-to-r from-background/80 to-transparent z-20 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => scroll('left')}>
          <ChevronLeft className="h-8 w-8" />
        </Button>
      )}
      <div ref={scrollRef} onScroll={handleScroll} className="flex overflow-x-auto space-x-4 px-4 md:px-8 pb-4 -mb-4 scrollbar-hide">
        {(movies.length > 0 ? movies : localData).map((movie) => (
          <div key={movie.id} className={`flex-shrink-0 ${isLarge ? 'w-40 sm:w-48' : 'w-64 sm:w-72'}`}>
            <MovieCard movie={movie} isLarge={isLarge} />
          </div>
        ))}
      </div>
      {showRightArrow && (
        <Button variant="ghost" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 h-full w-12 rounded-none bg-gradient-to-l from-background/80 to-transparent z-20 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => scroll('right')}>
          <ChevronRight className="h-8 w-8" />
        </Button>
      )}
    </div>
  );
};

export default ContentRow;