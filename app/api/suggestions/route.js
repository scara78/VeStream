import { NextResponse } from 'next/server';
import { searchTMDB } from '@/services/movieApi';

/**
 * API Route: Search Suggestions
 * Provides autocomplete suggestions for search
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const response = await searchTMDB(query);

    if (response?.results) {
      // Return top 5 suggestions
      const suggestions = response.results
        .filter((item) => item.media_type !== 'person')
        .slice(0, 5)
        .map((item) => ({
          title: item.title || item.name,
          type: item.media_type,
          id: item.id,
          year: (item.release_date || item.first_air_date || '').split('-')[0],
        }));

      return NextResponse.json(suggestions);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error('Search suggestions error:', error);
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
  }
}
