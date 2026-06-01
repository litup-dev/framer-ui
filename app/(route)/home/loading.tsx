const CardSkeleton = () => (
  <div className="flex flex-col gap-4">
    <div className="aspect-[4/5] rounded-sm bg-zinc-200 animate-pulse" />
    <div className="flex flex-col gap-2">
      <div className="h-3.5 w-2/3 rounded bg-zinc-200 animate-pulse" />
      <div className="h-[18px] w-full rounded bg-zinc-200 animate-pulse" />
      <div className="h-8 w-1/2 rounded-sm bg-zinc-200 animate-pulse" />
    </div>
  </div>
);

export default function HomeLoading() {
  return (
    <div className="w-full px-5 md:px-10 lg:px-[60px] 2xl:px-20 pt-[120px] md:pt-[160px] flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div className="h-6 w-32 rounded bg-zinc-200 animate-pulse" />
        <div className="h-4 w-24 rounded bg-zinc-200 animate-pulse" />
      </div>

      <div className="grid grid-cols-3 gap-x-2.5 gap-y-6 md:hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-x-3 lg:gap-x-4 2xl:gap-x-5 gap-y-8 lg:gap-y-10">
        {Array.from({ length: 10 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
