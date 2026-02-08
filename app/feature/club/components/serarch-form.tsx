"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";

import { Club } from "@/app/feature/club/types";
import { getClubsOptions } from "@/app/feature/club/query-options";
import {
  clubSearchFormSchema,
  defaultValues,
  ClubSearchFormSchema,
} from "@/app/feature/club/schema";
import { useQuery } from "@tanstack/react-query";

import MobileFilter from "@/app/feature/club/components/mobile-filter";
import DesktopFilter from "@/app/feature/club/components/desktop-filter";
import { useClubPagination } from "@/app/feature/club/hooks/use-club-pagination";
import { useGeolocation } from "@/app/feature/club/hooks/use-geolocation";
import { useClubSearchStorage } from "@/app/feature/club/hooks/use-club-search-storage";

const ClubSearchForm = () => {
  const [viewType, setViewType] = useState<"list" | "map">("list");
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [prevRegion, setPrevRegion] = useState<string>("");
  const { latitude, longitude, requestGeolocation, resetGeolocation } =
    useGeolocation();

  const form = useForm({
    resolver: zodResolver(clubSearchFormSchema),
    defaultValues: defaultValues,
  });

  const search = useWatch({ control: form.control, name: "search" });
  const region = useWatch({ control: form.control, name: "region" });
  const reviewSort = useWatch({ control: form.control, name: "reviewSort" });
  const reviewDate = useWatch({ control: form.control, name: "reviewDate" });
  const ratingSort = useWatch({ control: form.control, name: "ratingSort" });
  const keywords = useWatch({ control: form.control, name: "keywords" });

  const {
    currentPage,
    setCurrentPage,
    initialFilters,
    shouldResetFilters,
    setShouldResetFilters,
  } = useClubSearchStorage({
    filters: {
      search: search || "",
      region: region || "",
      reviewSort: reviewSort || undefined,
      reviewDate: reviewDate || undefined,
      ratingSort: ratingSort || undefined,
      keywords: keywords || undefined,
    },
  });

  const prevInitialFiltersRef = useRef<ClubSearchFormSchema | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (initialFilters) {
      const prevFiltersStr = prevInitialFiltersRef.current
        ? JSON.stringify(prevInitialFiltersRef.current)
        : "";
      const currentFiltersStr = JSON.stringify(initialFilters);

      if (prevFiltersStr !== currentFiltersStr || shouldResetFilters) {
        form.reset(initialFilters, { keepDefaultValues: false });
        prevInitialFiltersRef.current = initialFilters;
        if (shouldResetFilters) {
          setShouldResetFilters(false);
        }
      }
    } else if (prevInitialFiltersRef.current !== null) {
      prevInitialFiltersRef.current = null;
    }
  }, [initialFilters, shouldResetFilters, setShouldResetFilters, form]);

  const sort = reviewSort || reviewDate || ratingSort || "-reviewCount";

  useEffect(() => {
    if (region === "nearby" && prevRegion !== "nearby") {
      resetGeolocation();
      requestGeolocation();
    }
    if (region) {
      setPrevRegion(region);
    }
  }, [region, prevRegion, requestGeolocation, resetGeolocation]);

  const limit = 5;

  const clubsQueryOptions = useMemo(
    () =>
      getClubsOptions({
        searchKey: search || undefined,
        area: region || "seoul",
        sort,
        page: currentPage,
        limit,
        keywords: keywords && keywords.length > 0 ? keywords : undefined,
        latitude: region === "nearby" ? latitude ?? undefined : undefined,
        longitude: region === "nearby" ? longitude ?? undefined : undefined,
      }),
    [search, region, sort, currentPage, limit, keywords, latitude, longitude]
  );

  const { data } = useQuery({ ...clubsQueryOptions });

  const clubs = data?.data?.items || [];
  const total = data?.data?.total || 0;

  const pagination = useClubPagination({
    total,
    limit,
    currentPage,
    onPageChange: (page) => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  });

  return (
    <FormProvider {...form}>
      <div className="h-full">
        <div className="lg:hidden h-full">
          <MobileFilter
            clubs={clubs}
            setViewType={setViewType}
            viewType={viewType}
            selectedClub={selectedClub}
            setSelectedClub={setSelectedClub}
            pagination={pagination}
            currentPage={currentPage}
          />
        </div>
        <div className="hidden lg:block h-full">
          <DesktopFilter
            clubs={clubs}
            selectedClub={selectedClub}
            setSelectedClub={setSelectedClub}
            pagination={pagination}
            currentPage={currentPage}
          />
        </div>
      </div>
    </FormProvider>
  );
};

export default ClubSearchForm;
