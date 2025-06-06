import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <section>
        <div className="flex items-center mb-6">
          <Skeleton className="h-8 w-8 mr-3 rounded-full" />
          <Skeleton className="h-8 w-1/3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </section>
      <section>
        <div className="flex items-center mb-6">
          <Skeleton className="h-8 w-8 mr-3 rounded-full" />
          <Skeleton className="h-8 w-1/3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
