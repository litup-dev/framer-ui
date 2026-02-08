"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import { ClubSearchFormSchema, defaultValues } from "@/app/feature/club/schema";

const STORAGE_KEY = "club-search-filters";
const PAGE_STORAGE_KEY = "club-search-page";

const getStoredFilters = (): Partial<ClubSearchFormSchema> => {
  if (typeof window === "undefined") return {};

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to parse stored filters:", error);
  }
  return {};
};

const getStoredPage = (): number => {
  if (typeof window === "undefined") return 1;

  try {
    const stored = sessionStorage.getItem(PAGE_STORAGE_KEY);
    if (stored) {
      const page = parseInt(stored, 10);
      return isNaN(page) || page < 1 ? 1 : page;
    }
  } catch (error) {
    console.error("Failed to parse stored page:", error);
  }
  return 1;
};

const saveFiltersToStorage = (filters: Partial<ClubSearchFormSchema>) => {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch (error) {
    console.error("Failed to save filters to storage:", error);
  }
};

const savePageToStorage = (page: number) => {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(PAGE_STORAGE_KEY, String(page));
  } catch (error) {
    console.error("Failed to save page to storage:", error);
  }
};

export const clearStorage = () => {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(PAGE_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear storage:", error);
  }
};

const isClubRoute = (pathname: string | null): boolean => {
  if (!pathname) return false;
  return pathname === "/club" || pathname.startsWith("/club/");
};

if (typeof window !== "undefined") {
  let lastPathname = window.location.pathname;

  const checkPathAndClearStorage = () => {
    const currentPath = window.location.pathname;

    if (lastPathname !== currentPath && !isClubRoute(currentPath)) {
      clearStorage();
    }

    lastPathname = currentPath;
  };

  if (!isClubRoute(window.location.pathname)) {
    clearStorage();
  }

  window.addEventListener("popstate", checkPathAndClearStorage);

  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    originalPushState.apply(history, args);
    setTimeout(checkPathAndClearStorage, 0);
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function (...args) {
    originalReplaceState.apply(history, args);
    setTimeout(checkPathAndClearStorage, 0);
  };
}

interface UseClubSearchStorageProps {
  filters: {
    search: string;
    region: string;
    reviewSort?: string;
    reviewDate?: string;
    ratingSort?: string;
    keywords?: number[];
  };
}

export const useClubSearchStorage = ({
  filters,
}: UseClubSearchStorageProps) => {
  const pathname = usePathname();
  const prevPathnameRef = useRef<string | null>(null);
  const [prevFilters, setPrevFilters] = useState<string>("");
  const isInitializedRef = useRef(false);
  const isRestoringRef = useRef(false);

  const currentIsClubRoute = isClubRoute(pathname);
  const storedFilters = currentIsClubRoute ? getStoredFilters() : {};
  const initialPage = currentIsClubRoute ? getStoredPage() : 1;

  const initialFiltersValue = currentIsClubRoute
    ? ({
        ...defaultValues,
        ...storedFilters,
      } as ClubSearchFormSchema)
    : null;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [shouldResetFilters, setShouldResetFilters] = useState(false);
  const [initialFilters, setInitialFilters] =
    useState<ClubSearchFormSchema | null>(initialFiltersValue);

  useEffect(() => {
    const currentIsClubRoute = isClubRoute(pathname);
    const prevPath = prevPathnameRef.current;
    const prevIsClubRoute = isClubRoute(prevPath);
    const isReturningToClubList =
      prevPath && prevPath.startsWith("/club/") && pathname === "/club";

    if (!currentIsClubRoute) {
      clearStorage();
      if (currentPage !== 1) {
        setCurrentPage(1);
      }
      setInitialFilters(null);
    } else {
      const latestStoredFilters = getStoredFilters();
      const newInitialFilters = {
        ...defaultValues,
        ...latestStoredFilters,
      } as ClubSearchFormSchema;

      if (isReturningToClubList || !prevIsClubRoute) {
        isRestoringRef.current = true;
        setInitialFilters((prev) => {
          const prevStr = prev ? JSON.stringify(prev) : "";
          const newStr = JSON.stringify(newInitialFilters);
          if (prevStr !== newStr) {
            setShouldResetFilters(true);
            return newInitialFilters;
          }
          return prev || newInitialFilters;
        });

        const restoredPage = getStoredPage();
        setCurrentPage((prevPage) => {
          if (restoredPage !== prevPage) {
            return restoredPage;
          }
          return prevPage;
        });

        setTimeout(() => {
          isRestoringRef.current = false;
        }, 100);
      }
    }

    prevPathnameRef.current = pathname;
  }, [pathname]);

  const currentFiltersKey = useMemo(
    () =>
      JSON.stringify({
        search: filters.search || "",
        region: filters.region || "",
        reviewSort: filters.reviewSort || "",
        reviewDate: filters.reviewDate || "",
        ratingSort: filters.ratingSort || "",
        keywords: filters.keywords || [],
      }),
    [
      filters.search,
      filters.region,
      filters.reviewSort,
      filters.reviewDate,
      filters.ratingSort,
      filters.keywords,
    ]
  );

  useEffect(() => {
    if (!isClubRoute(pathname)) return;

    const filtersToSave: Partial<ClubSearchFormSchema> = {};

    if (filters.search && filters.search.length >= 5) {
      filtersToSave.search = filters.search;
    }

    if (filters.region && filters.region !== "") {
      filtersToSave.region = filters.region;
    }

    if (filters.reviewSort) {
      filtersToSave.reviewSort = filters.reviewSort;
    }

    if (filters.reviewDate) {
      filtersToSave.reviewDate = filters.reviewDate;
    }

    if (filters.ratingSort) {
      filtersToSave.ratingSort = filters.ratingSort;
    }

    if (filters.keywords && filters.keywords.length > 0) {
      filtersToSave.keywords = filters.keywords;
    }

    saveFiltersToStorage(filtersToSave);
  }, [
    filters.search,
    filters.region,
    filters.reviewSort,
    filters.reviewDate,
    filters.ratingSort,
    filters.keywords,
    pathname,
  ]);

  useEffect(() => {
    if (isRestoringRef.current) {
      setPrevFilters(currentFiltersKey);
      return;
    }

    if (prevFilters === "") {
      setPrevFilters(currentFiltersKey);
      return;
    }

    if (prevFilters !== currentFiltersKey) {
      setCurrentPage(1);
      savePageToStorage(1);
    }
    setPrevFilters(currentFiltersKey);
  }, [currentFiltersKey, prevFilters]);

  useEffect(() => {
    if (isClubRoute(pathname)) {
      savePageToStorage(currentPage);
    }
  }, [currentPage, pathname]);

  return {
    currentPage,
    setCurrentPage,
    initialFilters,
    shouldResetFilters,
    setShouldResetFilters,
  };
};
