"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import HeaderMenus from "@/app/shared/components/menus";
import Link from "next/link";
import { useClubDetailStore } from "@/app/feature/club/detail/store";
import { useUserStore } from "@/store/user-store";

const DesktopHeader = () => {
  const { user } = useUserStore()
  const pathname = usePathname();
  const isClubDetailPage =
    pathname?.startsWith("/club/") && pathname !== "/club";
  const [scrollProgress, setScrollProgress] = useState(0);
  const { isImageGalleryOpen, isReviewModalOpen } = useClubDetailStore();

  useEffect(() => {
    if (!isClubDetailPage) return;

    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const imageHeight = 490;
        const progress = Math.min(Math.max(scrollY / imageHeight, 0), 1);
        setScrollProgress(progress);
      });
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isClubDetailPage]);

  return (
    <div
      className={cn(
        "md:h-[80px] 2xl:h-[100px] px-5 sm:px-10 md:px-15 lg:px-20 hidden md:flex sm:justify-between",
        isClubDetailPage
          ? scrollProgress > 0
            ? "fixed top-0 left-0 right-0"
            : "absolute top-0 left-0 right-0 text-white"
          : "fixed top-0 left-0 right-0 bg-white",
        isReviewModalOpen
          ? "z-[40]"
          : isClubDetailPage
          ? "z-[99999]"
          : "z-[999999]"
      )}
      style={
        isClubDetailPage
          ? {
              backgroundColor: isImageGalleryOpen
                ? "transparent"
                : `rgba(255, 255, 255, ${scrollProgress})`,
              color:
                isImageGalleryOpen || scrollProgress > 0
                  ? "#111827"
                  : "#ffffff",
              opacity: isImageGalleryOpen ? 0 : 1,
              pointerEvents: isImageGalleryOpen ? "none" : "auto",
            }
          : isImageGalleryOpen
          ? {
              opacity: 0,
              pointerEvents: "none",
            }
          : undefined
      }
    >
      <div className="flex items-center gap-1">
        <div className="w-6 h-6 rounded-full bg-black" />
        <Link href="/home">logo</Link>
      </div>
      <HeaderMenus />
    </div>
  );
};

export default DesktopHeader;
