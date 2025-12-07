'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MovieCardSkeleton } from '@/components/Skeletons';

/**
 * Virtual Grid Component
 * Renders only visible items for better performance with large lists
 */
export default function VirtualGrid({
  items,
  renderItem,
  columnCount = 6,
  itemHeight = 400,
  gap = 16,
  loadMore,
  hasMore = false,
  loading = false,
  className = ''
}) {
  const containerRef = useRef(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const [containerHeight, setContainerHeight] = useState(0);

  // Calculate total height needed
  const rowCount = Math.ceil(items.length / columnCount);
  const totalHeight = rowCount * (itemHeight + gap);

  // Handle scroll and update visible range
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight;
    const containerTop = containerRef.current.offsetTop;

    // Calculate visible rows with buffer
    const scrollRelative = Math.max(0, scrollTop - containerTop);
    const startRow = Math.floor(scrollRelative / (itemHeight + gap));
    const endRow = Math.ceil((scrollRelative + viewportHeight) / (itemHeight + gap));

    // Add buffer rows above and below
    const bufferRows = 2;
    const bufferedStart = Math.max(0, startRow - bufferRows);
    const bufferedEnd = Math.min(rowCount, endRow + bufferRows);

    // Convert to item indices
    const start = bufferedStart * columnCount;
    const end = Math.min(items.length, bufferedEnd * columnCount);

    setVisibleRange({ start, end });

    // Check if we need to load more
    if (hasMore && !loading && endRow >= rowCount - 2) {
      loadMore?.();
    }
  }, [items.length, itemHeight, gap, columnCount, rowCount, hasMore, loading, loadMore]);

  // Set up scroll listener
  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  // Update container height
  useEffect(() => {
    setContainerHeight(totalHeight);
  }, [totalHeight]);

  // Get visible items
  const visibleItems = items.slice(visibleRange.start, visibleRange.end);
  const startRow = Math.floor(visibleRange.start / columnCount);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ height: `${containerHeight}px` }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
          gap: `${gap}px`,
          position: 'absolute',
          top: `${startRow * (itemHeight + gap)}px`,
          left: 0,
          right: 0
        }}
      >
        {visibleItems.map((item, index) => (
          <div key={item.id || visibleRange.start + index} style={{ height: `${itemHeight}px` }}>
            {renderItem(item, visibleRange.start + index)}
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
            gap: `${gap}px`,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0
          }}
        >
          {[...Array(columnCount)].map((_, i) => (
            <MovieCardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Responsive Virtual Grid
 * Automatically adjusts column count based on screen size
 */
export function ResponsiveVirtualGrid({
  items,
  renderItem,
  itemHeight = 400,
  gap = 16,
  loadMore,
  hasMore = false,
  loading = false,
  className = ''
}) {
  const [columnCount, setColumnCount] = useState(6);

  useEffect(() => {
    const updateColumnCount = () => {
      const width = window.innerWidth;
      if (width < 640) setColumnCount(2); // sm
      else if (width < 768) setColumnCount(3); // md
      else if (width < 1024) setColumnCount(4); // lg
      else if (width < 1280) setColumnCount(5); // xl
      else setColumnCount(6); // 2xl
    };

    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

  return (
    <VirtualGrid
      items={items}
      renderItem={renderItem}
      columnCount={columnCount}
      itemHeight={itemHeight}
      gap={gap}
      loadMore={loadMore}
      hasMore={hasMore}
      loading={loading}
      className={className}
    />
  );
}

/**
 * Infinite Scroll Hook
 * Provides infinite scrolling functionality
 */
export function useInfiniteScroll({ fetchMore, hasMore }) {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      await fetchMore(page + 1);
      setPage(p => p + 1);
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, fetchMore]);

  return { loading, loadMore, page };
}
