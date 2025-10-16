"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

import Logo from "@/app/shared/components/logo";
import HeaderMenus from "@/app/shared/components/menus";

const DesktopHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 py-5 px-5 sm:px-10 md:px-15 lg:px-20 hidden md:flex md:justify-between bg-white z-[999999] transition-opacity duration-300",
        isScrolled ? "opacity-90" : "opacity-100"
      )}
    >
      <Logo />
      <HeaderMenus />
    </div>
  );
};

export default DesktopHeader;
