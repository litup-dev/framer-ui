export function CommunityPostCardSkeleton() {
  return (
    <>
      {/* Desktop (xl+): flat row */}
      <div className="hidden xl:block py-5 border-b border-black/10 animate-pulse">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-black/10 flex-shrink-0" />
          <div className="flex flex-col gap-1">
            <div className="h-4 w-20 bg-black/10 rounded" />
            <div className="h-3 w-12 bg-black/5 rounded" />
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-5 w-3/4 bg-black/10 rounded" />
            <div className="h-5 w-1/2 bg-black/10 rounded" />
          </div>
          <div className="w-[96px] h-[96px] rounded-[4px] bg-black/10 flex-shrink-0" />
        </div>
        <div className="flex gap-3 mt-3">
          <div className="h-4 w-8 bg-black/10 rounded" />
          <div className="h-4 w-8 bg-black/10 rounded" />
          <div className="h-4 w-8 bg-black/10 rounded" />
        </div>
      </div>

      {/* Mobile / Tablet (<xl): card */}
      <div className="xl:hidden bg-white rounded-[6px] shadow-[0_4px_20px_0_rgba(0,0,0,0.04)] p-4 md:p-5 mb-3 animate-pulse">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-black/10 flex-shrink-0" />
            <div className="h-4 w-20 bg-black/10 rounded" />
          </div>
          <div className="h-3 w-12 bg-black/5 rounded" />
        </div>
        <div className="flex flex-col gap-2 mb-3">
          <div className="h-5 w-3/4 bg-black/10 rounded" />
          <div className="h-5 w-1/2 bg-black/10 rounded" />
        </div>
        <div className="flex gap-3">
          <div className="h-4 w-8 bg-black/10 rounded" />
          <div className="h-4 w-8 bg-black/10 rounded" />
          <div className="h-4 w-8 bg-black/10 rounded" />
        </div>
      </div>
    </>
  );
}
