"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";

import { cn } from "@/lib/utils";
import { PROMO_DUMMY_ITEMS, type PromoItem } from "./promo-dummy-data";

interface PromoSectionProps {
  items?: PromoItem[];
  /** 자동 넘김 사용 여부 */
  autoPlay?: boolean;
  /** 자동 넘김 간격(ms) */
  autoPlayInterval?: number;
  className?: string;
}

// 피그마 "지금 주목할 소식" 타이틀 아이콘 (34x34 기준)
const PromoTitleIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    <rect width="34" height="34" rx="17" fill="#4787D1" />
    <path
      d="M9.5 19.0003C9.5 17.5259 9.82533 16.1984 10.476 15.0175C11.1267 13.8369 11.8638 12.8183 12.6875 11.9618C13.5112 11.1054 14.3012 10.417 15.0578 9.89653C15.8141 9.37603 16.2948 9.04203 16.5 8.89453V11.3003C16.5 12.0708 16.7596 12.6801 17.2787 13.1283C17.7981 13.5763 18.3802 13.8003 19.025 13.8003C19.3275 13.8003 19.616 13.7452 19.8905 13.635C20.1648 13.5247 20.4232 13.3522 20.6655 13.1175L21.1058 12.6735C22.1327 13.3479 22.9552 14.2417 23.573 15.355C24.191 16.4685 24.5 17.6836 24.5 19.0003C24.5 20.5554 24.0795 21.9466 23.2385 23.1738C22.3973 24.4008 21.3027 25.2964 19.9545 25.8605C20.3258 25.4917 20.6142 25.0659 20.8197 24.583C21.0254 24.1 21.1283 23.5891 21.1283 23.0503C21.1283 22.5063 21.0258 21.9907 20.821 21.5035C20.6163 21.0164 20.3215 20.5781 19.9365 20.1888L17 17.3178L14.0885 20.1888C13.689 20.5814 13.3863 21.02 13.1805 21.5045C12.9747 21.9889 12.8717 22.5041 12.8717 23.0503C12.8717 23.5891 12.9746 24.1 13.1802 24.583C13.3857 25.0659 13.6742 25.4917 14.0455 25.8605C12.7015 25.2964 11.6079 24.4008 10.7647 23.1738C9.92158 21.9466 9.5 20.5554 9.5 19.0003ZM17 19.0773L19.0365 21.0733C19.301 21.3379 19.5063 21.6382 19.6525 21.974C19.7987 22.3099 19.8717 22.6686 19.8717 23.0503C19.8717 23.8281 19.5928 24.4929 19.035 25.0445C18.477 25.5962 17.7987 25.872 17 25.872C16.2013 25.872 15.523 25.5962 14.965 25.0445C14.4072 24.4929 14.1283 23.8281 14.1283 23.0503C14.1283 22.6743 14.198 22.3185 14.3375 21.983C14.477 21.6475 14.6857 21.3443 14.9635 21.0733L17 19.0773Z"
      fill="#F3703C"
    />
  </svg>
);

const PromoArrow = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M12 15.402L6 9.402L7.18325 8.21875L12 13.0353L16.8167 8.21875L18 9.402L12 15.402Z"
      fill="#171717"
    />
  </svg>
);

/**
 * 커뮤니티 홍보 섹션 (피그마: 커뮤니티 > 지금 주목할 소식)
 *
 * 반응형(피그마 시안 기준)
 * - 1600~   : 카드 302x378 / gap 24 / 화살표 48 / 컨텐츠 폭 1280
 * - 1280~1599: 카드 275x344 / gap 20 / 화살표 40 / 컨텐츠 폭 1160
 * - 744~1279: 카드 240x300 / gap 16 / 화살표 없음(우측 카드 일부 노출, 스와이프)
 * - ~743    : 카드 150x188 / gap 10 / 화살표 없음(우측 카드 일부 노출, 스와이프)
 */
export const PromoSection = ({
  items = PROMO_DUMMY_ITEMS,
  autoPlay = true,
  autoPlayInterval = 4000,
  className,
}: PromoSectionProps) => {
  const [viewportRef, api] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    // 드래그 시 카드 경계로 스냅(되돌아감)하지 않고 놓은 자리에서 관성 스크롤
    dragFree: true,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // dragFree에서는 스냅 인덱스가 실제 위치와 어긋나므로 스크롤 진행률 기준으로 판단
  const updateScrollState = useCallback(() => {
    if (!api) return;
    const progress = api.scrollProgress();
    setCanScrollPrev(progress > 0.001);
    setCanScrollNext(progress < 0.999);
  }, [api]);

  const scrollPrev = useCallback(() => {
    if (!api) return;
    const progress = api.scrollProgress();
    const snaps = api.scrollSnapList();
    let target = 0;
    for (let i = 0; i < snaps.length; i++) {
      if (snaps[i] < progress - 0.001) target = i;
    }
    api.scrollTo(target);
  }, [api]);

  const scrollNext = useCallback(() => {
    if (!api) return;
    const progress = api.scrollProgress();
    const snaps = api.scrollSnapList();
    const target = snaps.findIndex((snap) => snap > progress + 0.001);
    api.scrollTo(target === -1 ? snaps.length - 1 : target);
  }, [api]);

  useEffect(() => {
    if (!api) return;
    updateScrollState();
    api.on("scroll", updateScrollState);
    api.on("settle", updateScrollState);
    api.on("reInit", updateScrollState);
    return () => {
      api.off("scroll", updateScrollState);
      api.off("settle", updateScrollState);
      api.off("reInit", updateScrollState);
    };
  }, [api, updateScrollState]);

  // 자동 넘김: 끝에 도달하면 처음으로 복귀, 호버/드래그/탭 비활성 시 일시정지
  useEffect(() => {
    if (!api || !autoPlay) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = api.rootNode();
    let timer: ReturnType<typeof setInterval> | null = null;
    let hovering = false;

    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };
    const start = () => {
      stop();
      if (hovering || document.hidden) return;
      timer = setInterval(() => {
        if (api.scrollProgress() < 0.999) scrollNext();
        else api.scrollTo(0);
      }, autoPlayInterval);
    };
    const handleEnter = () => {
      hovering = true;
      stop();
    };
    const handleLeave = () => {
      hovering = false;
      start();
    };

    root.addEventListener("mouseenter", handleEnter);
    root.addEventListener("mouseleave", handleLeave);
    document.addEventListener("visibilitychange", start);
    api.on("pointerDown", stop);
    api.on("pointerUp", start);
    start();

    return () => {
      stop();
      root.removeEventListener("mouseenter", handleEnter);
      root.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("visibilitychange", start);
      api.off("pointerDown", stop);
      api.off("pointerUp", start);
    };
  }, [api, autoPlay, autoPlayInterval, scrollNext]);

  if (items.length === 0) return null;

  return (
    <section
      aria-label="지금 주목할 소식"
      className={cn("w-full bg-[#f7f6f5]", className)}
    >
      <div className="mx-auto py-10 min-[1280px]:w-[1160px] min-[1280px]:py-20 min-[1600px]:w-[1280px]">
        {/* 타이틀 */}
        <div className="mb-5 flex items-center gap-[10px] px-5 md:mb-6 md:px-10 min-[1280px]:mb-[30px] min-[1280px]:gap-3 min-[1280px]:px-0">
          <PromoTitleIcon className="size-6 shrink-0 md:size-7 min-[1280px]:size-[34px]" />
          <h2 className="text-[18px] font-semibold leading-none tracking-[-0.04em] text-[#171717] md:text-[20px] min-[1280px]:text-[24px]">
            지금 주목할 소식
          </h2>
        </div>

        {/* 캐러셀 */}
        <div className="relative">
          <div ref={viewportRef} className="overflow-hidden">
            <div className="flex gap-[10px] px-5 md:gap-4 md:px-10 min-[1280px]:gap-5 min-[1280px]:px-0 min-[1600px]:gap-6">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="relative block h-[188px] w-[150px] shrink-0 overflow-hidden rounded-[4px] bg-[#d9d9d9] md:h-[300px] md:w-[240px] min-[1280px]:h-[344px] min-[1280px]:w-[275px] min-[1600px]:h-[378px] min-[1600px]:w-[302px]"
                >
                  {item.image && (
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(min-width: 1600px) 302px, (min-width: 1280px) 275px, (min-width: 744px) 240px, 150px"
                      className="object-cover"
                    />
                  )}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_60%,rgba(0,0,0,0.8)_100%)]"
                  />
                  <p className="absolute bottom-[18px] left-[14px] right-[14px] whitespace-pre-line text-[15px] font-semibold leading-[1.4] tracking-[-0.04em] text-white md:bottom-7 md:left-5 md:right-5 md:text-[20px] min-[1280px]:bottom-8 min-[1280px]:left-6 min-[1280px]:right-6 min-[1280px]:text-[24px] min-[1600px]:left-7 min-[1600px]:right-7">
                    {item.mobileTitle ? (
                      <>
                        <span className="md:hidden">{item.mobileTitle}</span>
                        <span className="hidden md:inline">{item.title}</span>
                      </>
                    ) : (
                      item.title
                    )}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* 이전/다음 (1280~ 에서만 노출) */}
          <button
            type="button"
            aria-label="이전 슬라이드"
            disabled={!canScrollPrev}
            onClick={scrollPrev}
            className="absolute right-full top-1/2 mr-2 hidden size-10 -translate-y-1/2 items-center justify-center transition-opacity disabled:pointer-events-none disabled:opacity-10 min-[1280px]:flex min-[1600px]:mr-5 min-[1600px]:size-12"
          >
            <PromoArrow className="size-full rotate-90" />
          </button>
          <button
            type="button"
            aria-label="다음 슬라이드"
            disabled={!canScrollNext}
            onClick={scrollNext}
            className="absolute left-full top-1/2 ml-2 hidden size-10 -translate-y-1/2 items-center justify-center transition-opacity disabled:pointer-events-none disabled:opacity-10 min-[1280px]:flex min-[1600px]:ml-5 min-[1600px]:size-12"
          >
            <PromoArrow className="size-full -rotate-90" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
