import HeroSection from "@/app/feature/home/components/hero-section";
import MobileBottomNavigation from "@/app/feature/home/components/mobile-bottom-navigation";

// home-content.tsx와 같은 뼈대(히어로는 실제 컴포넌트, 캐러셀·캘린더만 스켈레톤).
// 배경 캐릭터는 home-shell(layout)에 있다. 스켈레톤에는 relative/z-index를 주지 않아야
// 위치 지정된 캐릭터 이미지가 스켈레톤 위에 그려진다(그래서 아래 래퍼들에 relative/z가 없다).
// 레이아웃 클래스는 home-content / main-content / desktop-main-content와 맞춰 둬야 전환 시 튀지 않는다.

const Pulse = ({ className }: { className: string }) => (
  <div className={`bg-zinc-200 animate-pulse ${className}`} />
);

const CardSkeleton = () => (
  <div className="flex flex-col gap-4">
    <Pulse className="aspect-[4/5] rounded-sm" />
    <div className="flex flex-col gap-2">
      <Pulse className="h-3.5 w-2/3 rounded" />
      <Pulse className="h-[18px] w-full rounded" />
      <Pulse className="h-8 w-1/2 rounded-sm" />
    </div>
  </div>
);

const SelectShowSkeleton = () => (
  <>
    <div className="flex items-center gap-4 md:hidden mt-[72px]">
      {Array.from({ length: 4 }).map((_, i) => (
        <Pulse key={i} className="h-5 w-12 rounded" />
      ))}
    </div>
    <div className="hidden md:flex md:flex-col gap-3 lg:gap-4 xl:gap-[18px] 2xl:gap-5">
      <div className="flex gap-3 lg:gap-4">
        <Pulse className="h-6 w-14 lg:w-16 2xl:h-7 2xl:w-20 rounded" />
        <Pulse className="h-6 w-14 lg:w-16 2xl:h-7 2xl:w-20 rounded" />
      </div>
      <div className="flex gap-3 lg:gap-4 md:pl-[30px] lg:pl-[40px] xl:pl-[48px] 2xl:pl-[64px]">
        <Pulse className="h-6 w-14 lg:w-16 2xl:h-7 2xl:w-20 rounded" />
        <Pulse className="h-6 w-14 lg:w-16 2xl:h-7 2xl:w-20 rounded" />
      </div>
    </div>
  </>
);

const PerformancesSkeleton = () => (
  <div className="w-full md:flex-1 md:min-w-0">
    {/* mobile */}
    <div className="grid grid-cols-3 gap-x-2.5 gap-y-6 md:hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>

    {/* md ~ xl 미만: 3열 그리드 */}
    <div className="hidden md:grid xl:hidden grid-cols-3 gap-x-3 lg:gap-x-4 gap-y-8 lg:gap-y-10">
      {Array.from({ length: 6 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>

    {/* xl 이상: 캐러셀 자리 */}
    <div className="hidden xl:block w-full min-h-[613px]">
      <div className="w-full overflow-hidden aspect-[12/5] 2xl:aspect-[3/1]">
        <div className="flex -ml-4 2xl:-ml-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="shrink-0 pl-4 2xl:pl-5 basis-1/4 2xl:basis-1/5"
            >
              <CardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// 캘린더는 xl 이상에서만 첫 화면에 보이고, 모바일/태블릿은 하단 탭으로 진입하므로 xl+ 전용.
const CalendarSkeleton = () => (
  <div className="hidden xl:block w-full bg-white xl:pt-[80px] 2xl:pt-[100px]">
    <div className="w-screen bg-gray">
      <div className="px-15 2xl:px-20 pb-[78px] 2xl:pb-[124px]">
        <Pulse className="h-[61px] w-[294px] rounded" />
      </div>
      <div className="grid grid-cols-7 px-15 2xl:px-20 pb-2 mb-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Pulse key={i} className="h-6 w-12 rounded ml-4 2xl:ml-6" />
        ))}
      </div>
      <div className="grid grid-cols-7 px-15 2xl:px-20 pb-[100px]">
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            className="h-[209px] 2xl:h-[314px] border border-white bg-zinc-200/60 animate-pulse"
          />
        ))}
      </div>
    </div>
  </div>
);

export default function HomeLoading() {
  return (
    <div>
      <div className="w-full flex flex-col h-full px-5 md:px-10 lg:px-15 xl:px-15 2xl:px-20 pb-10 xl:pb-20 pt-1 md:pt-20 2xl:pt-[100px] gap-10 md:gap-[131px] lg:gap-[152px] xl:gap-[155px] 2xl:gap-[182px]">
        <HeroSection />
        <div className="flex flex-col md:flex-row gap-4 md:gap-[7px] lg:gap-[6px] xl:gap-6 2xl:gap-[57px]">
          <div className="w-full md:w-[162px] md:shrink-0 lg:w-[224px] xl:w-[232px] 2xl:w-[240px]">
            <SelectShowSkeleton />
          </div>
          <PerformancesSkeleton />
        </div>
      </div>

      <CalendarSkeleton />
      <MobileBottomNavigation />
    </div>
  );
}
