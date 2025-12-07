import MovieCardSkeleton from '@/components/MovieCardSkeleton';
import { Skeleton } from '@/components/ui/Skeleton';

const ContentRowSkeleton = ({ isLarge = false }) => {
  return (
    <div className="mb-8">
      <div className="px-4 md:px-8">
        <Skeleton className="h-7 w-48 mb-4" />
      </div>
      <div className="flex overflow-x-auto space-x-4 px-4 md:px-8 pb-4 -mb-4 scrollbar-hide">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className={`flex-shrink-0 ${isLarge ? 'w-40 sm:w-48' : 'w-64 sm:w-72'}`}>
            <MovieCardSkeleton isLarge={isLarge} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentRowSkeleton;