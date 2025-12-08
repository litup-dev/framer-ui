"use client";

import { useState, useEffect } from "react";

export const useResponsive = (breakpoint: number = 1280) => {
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
