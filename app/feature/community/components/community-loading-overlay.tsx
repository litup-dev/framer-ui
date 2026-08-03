"use client";

import Image from "next/image";

interface CommunityLoadingOverlayProps {
  show: boolean;
  label?: string;
}

// 저장/등록 진행 중 표시하는 풀스크린 로딩. 메인 캐릭터가 pop-in + bounce.
export function CommunityLoadingOverlay({
  show,
  label = "저장 중...",
}: CommunityLoadingOverlayProps) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[9999999] bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center">
      <Image
        src="/images/main-character.png"
        alt=""
        width={160}
        height={160}
        className="animate-bounce drop-shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
        priority
      />
      <p className="mt-6 text-[15px] font-bold tracking-[-0.04em] text-black/80">
        {label}
      </p>
    </div>
  );
}
