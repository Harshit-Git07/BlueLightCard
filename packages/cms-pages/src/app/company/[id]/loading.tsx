import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex justify-center items-center">
      <article className="w-3/6 mx-auto">
        <header className="grid grid-cols-2 items-center gap-2 mt-10">
          <div className="flex items-top">
            <Skeleton className="h-20 w-20" />
          </div>
          <div>
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
          </div>
        </header>

        <section className="mt-8">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <div className="border rounded-xl shadow-sm my-5 p-5">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-40 w-40 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-6 w-full mb-2" />
                <div className="mt-10">
                  <Skeleton className="h-8 w-1/4 mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                </div>
              </div>
            </div>
            <hr className="my-4" />
            <div className="terms-and-conditions">
              <Skeleton className="h-8 w-1/3 mb-4" />
              <Skeleton className="h-6 w-full mb-2" />
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}
