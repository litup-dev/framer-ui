"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import HeaderMenus from "@/app/shared/components/menus";
import Link from "next/link";
import { useClubDetailStore } from "@/app/feature/club/detail/store";
import { useResponsive } from "@/components/shared/calendar/hooks/use-responsive";
import { useCurrentUser } from "@/app/feature/user/hooks/use-current-user";
import Image from "next/image";

const DesktopHeader = () => {
  const { user } = useCurrentUser();
  const pathname = usePathname();
  const isHomePage = pathname === "/home";
  const isClubPage = pathname === "/club";
  const isClubDetailPage =
    pathname?.startsWith("/club/") && pathname !== "/club";
  const [scrollProgress, setScrollProgress] = useState(0);
  const isXl = useResponsive(1280);
  const { isImageGalleryOpen, isReviewModalOpen } = useClubDetailStore();

  useEffect(() => {
    if (!isClubDetailPage && !isHomePage) return;

    let rafId: number | null = null;
    const scrollHeight = isClubDetailPage ? 490 : 200;

    const handleScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const progress = Math.min(Math.max(scrollY / scrollHeight, 0), 1);
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
  }, [isClubDetailPage, isHomePage]);

  return (
    <div
      className={cn(
        "h-[80px] 2xl:h-[100px] px-5 sm:px-10 md:px-10 lg:px-15 xl:px-15 2xl:px-20 hidden md:flex md:justify-between",
        isClubPage && "border-b border-black/20",
        isClubDetailPage
          ? scrollProgress > 0
            ? "fixed top-0 left-0 right-0"
            : "absolute top-0 left-0 right-0 text-white"
          : isHomePage
            ? cn(
                "fixed top-0 left-0 right-0",
                scrollProgress === 0
                  ? "bg-transparent text-white"
                  : "text-black",
              )
            : "fixed top-0 left-0 right-0 bg-white",
        isReviewModalOpen
          ? "z-[40]"
          : isClubDetailPage
            ? "z-[99999]"
            : "z-[999999]",
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
          : isHomePage
            ? {
                backgroundColor: `rgba(255, 255, 255, ${scrollProgress})`,
                mixBlendMode:
                  scrollProgress === 0 ? "difference" : "normal",
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
        <Link href="/home">
          <Image
            src="/images/logo.svg"
            alt="logo"
            width={120}
            height={38}
            className={cn(
              "w-[84px] h-[26px] lg:w-[100px] lg:h-[32px] xl:w-[110px] xl:h-[34px] 2xl:w-[120px] 2xl:h-[38px]",
              isHomePage && scrollProgress === 0 && "brightness-0 invert",
              isClubDetailPage && scrollProgress === 0 && "brightness-0 invert",
            )}
          />
        </Link>
      </div>
      <HeaderMenus
        isWhiteIcons={
          (isClubDetailPage || isHomePage) && scrollProgress === 0
        }
      />
    </div>
  );
};

export default DesktopHeader;
