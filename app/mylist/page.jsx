'use client';

import React from 'react';
import Link from 'next/link';
import { useLibrary } from '@/hooks/useLibrary';
import MovieCard from '@/components/MovieCard';
import { Bookmark, Film } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function MyListPage() {
    const { watchlist } = useLibrary();

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4 md:px-8">
            <div className="container mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20">
                        <Bookmark className="w-6 h-6 text-[#00ff88]" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight">My List</h1>
                        <p className="text-gray-400 mt-1">
                            {watchlist.length} {watchlist.length === 1 ? 'item' : 'items'} saved
                        </p>
                    </div>
                </div>

                {watchlist.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {watchlist.map((movie, index) => (
                            <MovieCard key={movie.id} movie={movie} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                            <Film className="w-10 h-10 text-gray-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Your list is empty</h2>
                        <p className="text-gray-400 mb-8 max-w-md">
                            Save movies and TV shows to your list to keep track of what you want to watch.
                        </p>
                        <Link href="/search">
                            <Button className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 font-bold px-8 py-3 rounded-xl">
                                Browse Content
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
