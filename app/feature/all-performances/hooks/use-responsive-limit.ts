import { useState, useEffect } from "react";

export const useResponsiveLimit = () => {
  const [limit, setLimit] = useState(18);

  useEffect(() => {
    const updateLimit = () => {
      const width = window.innerWidth;
      if (width >= 1536) {
        setLimit(24);
      } else if (width >= 1280) {
        setLimit(20);
      } else if (width >= 1024) {
        setLimit(20);
      } else {
        setLimit(18);
      }
    };

    updateLimit();
    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, []);

  return limit;
};
