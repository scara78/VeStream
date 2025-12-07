import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu"
import { Button } from "@/components/ui/Button"
import { ArrowDownUp } from 'lucide-react';

const sortOptions = [
  { label: 'Popularity (Desc)', value: 'popularity.desc' },
  { label: 'Popularity (Asc)', value: 'popularity.asc' },
  { label: 'Release Date (Desc)', value: 'primary_release_date.desc' },
  { label: 'Release Date (Asc)', value: 'primary_release_date.asc' },
  { label: 'Vote Average (Desc)', value: 'vote_average.desc' },
  { label: 'Vote Average (Asc)', value: 'vote_average.asc' },
];

const SortByFilter = ({ type, currentSort, currentGenreId }) => {
  const selectedSort = sortOptions.find(opt => opt.value === currentSort);

  const getSortUrl = (sortByValue) => {
    const params = new URLSearchParams();
    if (currentGenreId) {
      params.set('genre', currentGenreId);
    }
    if (sortByValue) {
      params.set('sort_by', sortByValue);
    }
    return `/browse/${type}?${params.toString()}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <ArrowDownUp className="mr-2 h-4 w-4" />
          {selectedSort ? selectedSort.label : 'Sort By'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {sortOptions.map((option) => (
          <DropdownMenuItem key={option.value} asChild>
            <Link href={getSortUrl(option.value)}>{option.label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortByFilter;