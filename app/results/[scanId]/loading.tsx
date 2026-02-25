import { Skeleton } from "@/components/ui/skeleton";

export default function ResultsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 space-y-8">
      <div className="rounded-xl border bg-card p-8">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-[180px] w-[180px] rounded-full" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
