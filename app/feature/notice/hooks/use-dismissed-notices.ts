"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "notice-dismissed-ids";

const readFromStorage = (): number[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is number => typeof v === "number");
  } catch {
    return [];
  }
};

export const useDismissedNotices = () => {
  const [dismissedIds, setDismissedIds] = useState<number[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setDismissedIds(readFromStorage());
    setIsHydrated(true);
  }, []);

  const dismiss = useCallback((id: number) => {
    setDismissedIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore quota errors
      }
      return next;
    });
  }, []);

  return { dismissedIds, dismiss, isHydrated };
};
