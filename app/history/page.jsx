'use client';

import React from 'react';
import Link from 'next/link';
import { useLibrary } from '@/hooks/useLibrary';
import MovieCard from '@/components/MovieCard';
import { Clock, Trash2, Film } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HistoryPage() {
    const { history, clearHistory } = useLibrary();

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4 md:px-8">
            <div className="container mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20">
                            <Clock className="w-6 h-6 text-[#00ff88]" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Watch History</h1>
                            <p className="text-gray-400 mt-1">
                                Recently watched content
                            </p>
                        </div>
                    </div>

                    {history.length > 0 && (
                        <Button
                            onClick={clearHistory}
                            variant="outline"
                            className="border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400 gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear History
                        </Button>
                    )}
                </div>

                {history.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {history.map((movie, index) => (
                            <MovieCard key={movie.id} movie={movie} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                            <Film className="w-10 h-10 text-gray-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">No watch history</h2>
                        <p className="text-gray-400 mb-8 max-w-md">
                            Movies and TV shows you watch will appear here.
                        </p>
                        <Link href="/">
                            <Button className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 font-bold px-8 py-3 rounded-xl">
                                Start Watching
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
