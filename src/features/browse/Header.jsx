import Link from 'next/link';
import { Clapperboard } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import MainNav from '@/components/MainNav';
import UserNav from '@/components/UserNav';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-6 flex items-center space-x-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
            <Clapperboard className="h-6 w-6 text-primary" />
            VeStream
          </Link>
          <MainNav />
        </div>
        <div className="flex flex-1 items-center justify-end">
          <UserNav />
          <SearchBar />
        </div>
      </div>
    </header>
  );
};

export default Header;