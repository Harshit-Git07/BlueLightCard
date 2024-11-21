import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const OfferCollectionSkeleton = () => {
  return (
    <div className="flex justify-center items-center">
      <article className="w-full md:w-3/4 lg:w-4/5 xl:w-4/5 mx-auto">
        <header className="flex items-center mt-10 justify-center">
          <Skeleton className="w-60 h-60" />
        </header>
        <section className="mt-8">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-5/6 mx-auto my-4" />
          <div className="flex flex-wrap justify-center">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="p-4 m-2 w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-6 w-3/4 mx-auto my-4" />
                  <Skeleton className="h-6 w-1/2 mx-auto" />
                </div>
              ))}
          </div>
        </section>
      </article>
    </div>
  );
};

export default OfferCollectionSkeleton;
