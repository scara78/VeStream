'use client'; // This component now uses a client-side hook via WatchlistButton

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { API_CONFIG } from '@/constants/config';
import { Button } from '@/components/ui/Button';
import WatchlistButton from '@/components/WatchlistButton';
import HeroCarouselSkeleton from './HeroCarouselSkeleton';

const HeroCarousel = () => {
  const [heroMovie, setHeroMovie] = useState(null);

  useEffect(() => {
    const fetchHeroMovie = async () => {
      try {
        const url = `${API_CONFIG.TMDB_BASE}/trending/movie/day?api_key=${API_CONFIG.TMDB_KEY}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setHeroMovie(data.results?.[0]);
        }
      } catch (error) {
        console.error('Failed to fetch hero movie:', error);
      }
    };

    fetchHeroMovie();
  }, []);

  if (!heroMovie) {
    return <HeroCarouselSkeleton />;
  }

  return (
    <div className="relative h-[60vh] md:h-[85vh] w-full">
      <div className="absolute inset-0">
        <Image
          src={`${API_CONFIG.TMDB_IMG}${heroMovie.backdrop_path}`}
          alt={heroMovie.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col justify-end h-full p-4 md:p-12 text-white">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-black text-shadow-lg mb-4">{heroMovie.title}</h1>
          <p className="text-sm md:text-base text-shadow-md line-clamp-3 mb-6">{heroMovie.overview}</p>
          <div className="flex items-center gap-4">
            <Link href={`/watch/movie/${heroMovie.id}`}>
              <Button size="lg">
                <Play className="mr-2 h-5 w-5" fill="currentColor" /> Watch Now
              </Button>
            </Link>
            <WatchlistButton movie={heroMovie} size="lg" variant="secondary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;