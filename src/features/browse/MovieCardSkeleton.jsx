import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';

const MovieCardSkeleton = ({ isLarge = false }) => {
  return (
    <Card className="overflow-hidden">
      <div className={`aspect-video ${isLarge ? 'sm:aspect-[2/3]' : ''}`}>
        <Skeleton className="w-full h-full" />
      </div>
    </Card>
  );
};

export default MovieCardSkeleton;