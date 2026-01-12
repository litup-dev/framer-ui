"use client";

import { useState, useEffect, useMemo } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Club } from "@/app/feature/club/types";
import { getClubsOptions } from "@/app/feature/club/query-options";
import {
  clubSearchFormSchema,
  ClubSearchFormSchema,
  defaultValues,
} from "@/app/feature/club/schema";
import { useQuery } from "@tanstack/react-query";

import MobileFilter from "@/app/feature/club/components/mobile-filter";
import DesktopFilter from "@/app/feature/club/components/desktop-filter";
import { useClubPagination } from "@/app/feature/club/hooks/use-club-pagination";
import { useGeolocation } from "@/app/feature/club/hooks/use-geolocation";

const ClubSearchForm = () => {
  const [viewType, setViewType] = useState<"list" | "map">("list");
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [prevRegion, setPrevRegion] = useState<string>("");
  const { latitude, longitude, requestGeolocation, resetGeolocation } =
    useGeolocation();

  const form = useForm<ClubSearchFormSchema>({
    resolver: zodResolver(clubSearchFormSchema),
    defaultValues: defaultValues,
  });

  const search = useWatch({ control: form.control, name: "search" });
  const region = useWatch({ control: form.control, name: "region" });
  const reviewSort = useWatch({ control: form.control, name: "reviewSort" });
  const reviewDate = useWatch({ control: form.control, name: "reviewDate" });
  const ratingSort = useWatch({ control: form.control, name: "ratingSort" });
  const keywords = useWatch({ control: form.control, name: "keywords" });

  const sort = reviewSort || reviewDate || ratingSort || "-reviewCount";

  useEffect(() => {
    setCurrentPage(1);
  }, [search, region, sort, keywords]);

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
