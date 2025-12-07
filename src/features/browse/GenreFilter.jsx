import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu"
import { Button } from "@/components/ui/Button"
import { API_CONFIG } from '@/constants/config';
import { ListFilter } from 'lucide-react';

const GenreFilter = async ({ type, selectedGenreId }) => {
  let genres = [];
  try {
    const url = `${API_CONFIG.TMDB_BASE}/genre/${type}/list?api_key=${API_CONFIG.TMDB_KEY}`;
    const res = await fetch(url, { next: { revalidate: 86400 } }); // Cache for 24 hours
    if (res.ok) {
      const data = await res.json();
      genres = data.genres || [];
    }
  } catch (error) {
    console.error(`Failed to fetch ${type} genres:`, error);
  }

  const selectedGenre = genres.find(g => g.id.toString() === selectedGenreId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <ListFilter className="mr-2 h-4 w-4" />
          {selectedGenre ? selectedGenre.name : 'All Genres'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/browse/${type}`}>All Genres</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {genres.map((genre) => (
          <DropdownMenuItem key={genre.id} asChild>
            <Link href={`/browse/${type}?genre=${genre.id}`}>{genre.name}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GenreFilter;