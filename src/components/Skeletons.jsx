/**
 * Skeleton Loading Components
 * Provides better UX during content loading
 */

export function MovieCardSkeleton() {
  return (
    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-white/5 border border-white/10 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
        <div className="h-4 bg-white/20 rounded w-3/4" />
        <div className="h-3 bg-white/10 rounded w-1/2" />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[85vh] bg-black/50 animate-pulse">
      <div className="absolute bottom-24 left-8 right-8 max-w-3xl space-y-6">
        <div className="h-8 bg-white/20 rounded w-1/4" />
        <div className="h-16 bg-white/20 rounded w-3/4" />
        <div className="h-4 bg-white/10 rounded w-2/3" />
        <div className="h-4 bg-white/10 rounded w-1/2" />
        <div className="flex gap-4">
          <div className="h-12 bg-white/20 rounded w-32" />
          <div className="h-12 bg-white/20 rounded w-32" />
        </div>
      </div>
    </div>
  );
}

export function ContentRowSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-white/20 rounded w-48 animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function PlayerSkeleton() {
  return (
    <div className="aspect-video bg-black/50 rounded-2xl flex items-center justify-center border border-white/10 animate-pulse">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-white/20" />
        <div className="h-4 bg-white/20 rounded w-32 mx-auto" />
      </div>
    </div>
  );
}

export function CastSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-2 animate-pulse">
          <div className="aspect-[2/3] bg-white/10 rounded-lg" />
          <div className="h-3 bg-white/10 rounded w-3/4" />
          <div className="h-2 bg-white/5 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function TrailerSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="relative aspect-video bg-white/10 rounded-lg animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SeasonSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-4 bg-white/5 rounded-lg animate-pulse">
          <div className="h-4 bg-white/20 rounded w-1/4 mb-2" />
          <div className="h-3 bg-white/10 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}

export function WatchPageSkeleton() {
  return (
    <div className="min-h-screen bg-black text-white pb-24 animate-fade-in relative overflow-hidden">
      {/* Hero Background Skeleton */}
      <div className="fixed inset-0 z-0 bg-white/5 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      {/* Back Button Skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 pt-6 pb-12 pl-6">
        <div className="h-10 w-32 bg-white/10 backdrop-blur-md rounded-xl animate-pulse border border-white/5" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-32 md:pt-40">
        <div className="max-w-[1600px] mx-auto">
          {/* Title & Meta Skeleton */}
          <div className="mb-12 space-y-6 animate-pulse">
            <div className="h-6 w-24 bg-[#00ff88]/20 rounded-full" />
            <div className="h-16 bg-white/10 rounded-2xl w-3/4 max-w-3xl backdrop-blur-sm" />
            <div className="flex gap-4">
              <div className="h-8 bg-white/10 rounded-lg w-24" />
              <div className="h-8 bg-white/10 rounded-lg w-20" />
              <div className="h-8 bg-white/10 rounded-lg w-32" />
            </div>
          </div>

          {/* Player Skeleton with Cinema Glow */}
          <div className="relative mb-12 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00ff88]/10 via-[#00cc66]/5 to-[#00ff88]/10 rounded-2xl blur-3xl opacity-50" />
            <div className="relative bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <div className="aspect-video bg-white/5 flex items-center justify-center animate-pulse">
                <div className="w-24 h-24 rounded-full bg-white/10 border border-white/5" />
              </div>
            </div>
          </div>

          {/* Controls & Info Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-10">
              {/* Control Panel Skeleton */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 animate-pulse h-24" />

              {/* Synopsis Skeleton */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/5 space-y-4 animate-pulse">
                <div className="h-8 bg-white/10 rounded w-48 mb-6" />
                <div className="space-y-3">
                  <div className="h-4 bg-white/5 rounded w-full" />
                  <div className="h-4 bg-white/5 rounded w-full" />
                  <div className="h-4 bg-white/5 rounded w-5/6" />
                </div>
                <div className="flex gap-3 mt-6">
                  <div className="h-8 w-24 bg-white/10 rounded-xl" />
                  <div className="h-8 w-32 bg-white/10 rounded-xl" />
                  <div className="h-8 w-20 bg-white/10 rounded-xl" />
                </div>
              </div>

              {/* Cast Skeleton */}
              <div className="space-y-6">
                <div className="h-8 bg-white/10 rounded w-32 animate-pulse" />
                <CastSkeleton />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 h-[400px] animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default {
  MovieCardSkeleton,
  HeroSkeleton,
  ContentRowSkeleton,
  PlayerSkeleton,
  CastSkeleton,
  TrailerSkeleton,
  SeasonSkeleton,
  WatchPageSkeleton,
};
