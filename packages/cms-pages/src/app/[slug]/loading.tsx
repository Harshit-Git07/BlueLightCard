import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex justify-center items-center mx-auto">
      <article className="w-4/6 mx-auto">
        <header className="grid grid-cols-2 items-center gap-2 mt-10">
          <Skeleton className="h-20 w-full" />
        </header>

        {Array(3)
          .fill(0)
          .map((_, index) => (
            <section key={index} className=" my-10">
              <Skeleton className="h-20 w-1/2 mb-4" />
              <div className="my-15">
                <div className="flex">
                  {Array(5)
                    .fill(0)
                    .map((_, itemIndex) => (
                      <Skeleton key={itemIndex} className="h-72 w-48 mr-4" />
                    ))}
                </div>
              </div>
            </section>
          ))}
      </article>
    </div>
  );
}
