"use client";

import { usePathname } from "next/navigation";
import DesktopHeader from "@/app/shared/components/desktop-header";
import MobileHeader from "@/app/shared/components/mobile-header";

const Header = () => {
  const pathname = usePathname();

  const isClubDetailPage =
    pathname?.startsWith("/club/") && pathname !== "/club";

  return (
    <>
      <DesktopHeader />
      {!isClubDetailPage && <MobileHeader />}
    </>
  );
};

export default Header;
