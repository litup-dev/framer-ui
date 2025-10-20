"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

import Logo from "@/app/shared/components/logo";
import HeaderMenus from "@/app/shared/components/menus";
import Link from "next/link";

const DesktopHeader = () => {
  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 py-5 px-5 sm:px-10 md:px-15 lg:px-20 hidden sm:flex sm:justify-between bg-white z-[999999] transition-opacity duration-300"
      )}
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
