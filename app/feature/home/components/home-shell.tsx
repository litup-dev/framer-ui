import { PropsWithChildren } from "react";

import HomeCharacterImage from "@/app/feature/home/components/home-character-image";

// 배경 캐릭터를 layout에 두어, loading.tsx 스켈레톤 -> 실제 페이지 전환과 무관하게
// 리마운트/깜빡임 없이 첫 화면부터 계속 떠 있게 한다.
// z-[1]: loading 스켈레톤(animate-pulse는 opacity 때문에 z 0 레이어)보다는 위,
// 실제 콘텐츠(home-content의 z-10)보다는 아래라서 기존 겹침 순서는 그대로다.
export default function HomeShell({ children }: PropsWithChildren) {
  return (
    <div className="relative overflow-x-hidden">
      <div className="absolute inset-0 z-[1] pointer-events-none" aria-hidden>
        <HomeCharacterImage />
      </div>
      {children}
    </div>
  );
}
