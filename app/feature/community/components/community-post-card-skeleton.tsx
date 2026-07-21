export function CommunityPostCardSkeleton() {
  return (
    <div className="py-6 md:py-7 md:border-b md:border-black/10 bg-white rounded md:rounded-none shadow-[0_4px_20px_0_rgba(0,0,0,0.04)] md:shadow-none animate-pulse">
      <div className="px-5 md:px-0 flex flex-col gap-4 md:gap-5">
        <div className="h-4 w-16 bg-black/10 rounded" />
        <div className="flex flex-col gap-2">
          <div className="h-6 w-3/4 bg-black/10 rounded" />
          <div className="h-4 w-full bg-black/5 rounded" />
          <div className="h-4 w-2/3 bg-black/5 rounded" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-black/10" />
            <div className="h-4 w-20 bg-black/10 rounded" />
          </div>
          <div className="flex gap-3">
            <div className="h-4 w-10 bg-black/10 rounded" />
            <div className="h-4 w-10 bg-black/10 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
