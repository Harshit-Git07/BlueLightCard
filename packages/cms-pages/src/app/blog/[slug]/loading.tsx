import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center">
      <article className="w-3/4 mx-auto">
        <Skeleton className="h-12 w-full mt-10" />
        <div className="flex justify-between items-center mt-4">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-1/4" />
        </div>
        <Skeleton className="h-96 w-full mt-6" />
        <Skeleton className="h-40 w-full mt-6" />
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} className="h-20 w-full mt-4" />
          ))}
      </article>
    </div>
  );
}
