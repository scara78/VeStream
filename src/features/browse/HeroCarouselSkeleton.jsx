import { Skeleton } from '@/components/ui/Skeleton';

const HeroCarouselSkeleton = () => {
  return (
    <div className="relative h-[60vh] md:h-[85vh] w-full">
      <Skeleton className="h-full w-full" />
      <div className="absolute z-10 flex flex-col justify-end h-full p-4 md:p-12 w-full">
        <div className="max-w-2xl">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-2/3 mb-6" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-36" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCarouselSkeleton;