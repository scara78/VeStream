import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getTMDBDetails } from '@/services/movieApi';
import WatchClient from './WatchClient';
import { PlayerSkeleton } from '@/components/Skeletons';

/**
 * VeStream Watch Page - Server Component with ISR
 * Features: Static generation with revalidation for better performance and SEO
 */

// Dynamic rendering to avoid build-time timeouts
export const dynamic = 'force-dynamic';

// Disable static params generation due to API timeout issues
// This can be re-enabled once API performance improves
// export async function generateStaticParams() {
//   const { getTMDBTrending } = await import('@/services/movieApi');
// 
//   try {
//     const [trendingMovies, trendingTV] = await Promise.all([
//       getTMDBTrending('movie', 'week'),
//       getTMDBTrending('tv', 'week')
//     ]);
// 
//     const movieParams = trendingMovies?.results?.slice(0, 25).map((item) => ({
//       type: 'movie',
//       id: String(item.id)
//     })) || [];
// 
//     const tvParams = trendingTV?.results?.slice(0, 25).map((item) => ({
//       type: 'tv',
//       id: String(item.id)
//     })) || [];
// 
//     return [...movieParams, ...tvParams];
//   } catch (error) {
//     console.error('Error generating static params:', error);
//     return [];
//   }
// }

// Generate dynamic metadata for SEO
export async function generateMetadata({ params, searchParams }) {
  const { id, type } = await params;

  try {
    const tmdbDetails = await getTMDBDetails(id, type);
    const title = tmdbDetails.title || tmdbDetails.name;
    const description = tmdbDetails.overview || `Watch ${title} on VeStream`;
    const posterUrl = tmdbDetails.poster_path
      ? `https://image.tmdb.org/t/p/w500${tmdbDetails.poster_path}`
      : '/og-image.png';

    return {
      title: `${title} - Watch on VeStream`,
      description,
      openGraph: {
        title: `${title} - VeStream`,
        description,
        images: [
          {
            url: posterUrl,
            width: 500,
            height: 750,
            alt: title
          }
        ],
        type: 'video.other'
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} - VeStream`,
        description,
        images: [posterUrl]
      }
    };
  } catch (error) {
    return {
      title: 'Watch on VeStream',
      description: 'Stream unlimited movies and TV shows'
    };
  }
}

export default async function WatchPage({ params, searchParams }) {
  const { id: tmdbId, type: mediaType } = await params;
  const resolvedSearchParams = await searchParams;
  const season = resolvedSearchParams?.season;
  const episode = resolvedSearchParams?.episode;

  // Server-side data fetching with timeout handling
  let initialData = {
    tmdbData: null,
    tmdbId,
    mediaType,
    season,
    episode
  };

  try {
    // Attempt to fetch TMDB details on the server with a timeout
    const tmdbDetails = await Promise.race([
      getTMDBDetails(tmdbId, mediaType),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('TMDB fetch timeout')), 5000)
      )
    ]);

    initialData.tmdbData = tmdbDetails;
  } catch (error) {
    // Only log in development to reduce console noise
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching initial TMDB data:', error.message);
    }
    // Continue with null tmdbData - client will fetch it
  }

  return (
    <Suspense fallback={<PlayerSkeleton />}>
      <WatchClient initialData={initialData} />
    </Suspense>
  );
}
