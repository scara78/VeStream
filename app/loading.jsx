import { Loader } from 'lucide-react';

/**
 * Global Loading Component for Next.js App Router
 * Displayed during route transitions and page loads
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          {/* Animated VeStream Logo */}
          <div className="w-24 h-24 mx-auto rounded-full bg-[#00ff88]/10 flex items-center justify-center border-4 border-[#00ff88]/30 animate-pulse">
            <Loader className="w-12 h-12 text-[#00ff88] animate-spin" />
          </div>

          {/* Pulsing rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-2 border-[#00ff88]/20 animate-ping" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2 animate-pulse">
          Loading VeStream
        </h2>
        <p className="text-gray-400 text-sm">Preparing your streaming experience...</p>
      </div>
    </div>
  );
}
