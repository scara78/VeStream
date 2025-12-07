import Link from 'next/link';
import { Search, Home, Film } from 'lucide-react';

/**
 * Custom 404 Page for VeStream
 * Displayed when a route is not found
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        {/* 404 Glitch Effect */}
        <div className="mb-8 relative">
          <h1
            className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00ff88]/50 mb-4"
            style={{
              textShadow: '0 0 80px rgba(0, 255, 136, 0.5)',
            }}
          >
            404
          </h1>

          {/* Animated scanlines */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff88]/5 to-transparent animate-pulse pointer-events-none" />
        </div>

        <h2 className="text-4xl font-bold text-white mb-4">Page Not Found</h2>

        <p className="text-gray-400 text-lg mb-2">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <p className="text-gray-500 mb-12">
          Don't worry though, there's plenty of great content waiting for you!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#00ff88] text-black px-8 py-4 rounded-lg font-bold hover:bg-[#00ff88]/90 transition-all hover:scale-105 w-full sm:w-auto justify-center"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>

          <Link
            href="/?search=trending"
            className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-4 rounded-lg font-bold hover:bg-white/20 transition-all border border-white/20 w-full sm:w-auto justify-center"
          >
            <Search className="w-5 h-5" />
            Search Content
          </Link>
        </div>

        {/* Popular Suggestions */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h3 className="text-white font-bold text-xl mb-4 flex items-center justify-center gap-2">
            <Film className="w-6 h-6 text-[#00ff88]" />
            Popular Right Now
          </h3>
          <p className="text-gray-400 text-sm">
            Check out what's trending or explore our curated collections on the homepage.
          </p>
        </div>

        {/* Ambient Glow */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00ff88]/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      </div>
    </div>
  );
}
