"use client";

import { useState, useEffect } from "react";
import { CALENDAR_BREAKPOINT } from "@/components/shared/calendar/constants";

export const useResponsive = (breakpoint: number = CALENDAR_BREAKPOINT.xl) => {
  const [isXl, setIsXl] = useState(false);

  useEffect(() => {
    const checkXl = () => {
      setIsXl(window.innerWidth >= breakpoint);
    };
    checkXl();
    window.addEventListener("resize", checkXl);
    return () => window.removeEventListener("resize", checkXl);
  }, [breakpoint]);

  return isXl;
};
