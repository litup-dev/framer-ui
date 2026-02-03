"use client";

import { useEffect } from "react";
import { Map } from "lucide-react";
import { ChevronDown, List } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { ClubSearchFormSchema } from "@/app/feature/club/schema";
import {
  region as regionOptions,
  filterItems,
} from "@/app/feature/club/constants";
import { useFilterState } from "@/app/feature/club/hooks/use-filter-state";
import { getReviewCategoryOptions } from "@/app/feature/club/query-options";

import { Description, Subtitle } from "@/components/shared/typography";
import { Separator } from "@/components/ui/separator";

import KakaoMap from "@/app/feature/club/components/kakao-map";
import SearchFormField from "@/app/feature/club/components/search-form-field";
import { Club } from "@/app/feature/club/types";
import ClubCard from "@/app/feature/club/components/club-card";
import KeywordList from "@/app/feature/club/components/keyword-list";
import { ClubsPagination } from "@/app/feature/club/components/clubs-pagination";

type FilterItem = (typeof filterItems)[number];

const MobileFilter = ({
  setViewType,
  viewType,
  selectedClub,
  setSelectedClub,
  clubs,
  pagination,
  currentPage,
}: {
  setViewType: (viewType: "list" | "map") => void;
  viewType: "list" | "map";
  selectedClub: Club | null;
  setSelectedClub: (club: Club | null) => void;
  clubs: Club[];
  pagination: {
    totalPages: number;
    pageNumbers: (string | number)[];
    handlePageClick: (page: number) => void;
    handlePreviousClick: () => void;
    handleNextClick: () => void;
    canGoPrevious: boolean;
    canGoNext: boolean;
  };
  currentPage: number;
}) => {
  const { setValue, watch } = useFormContext<ClubSearchFormSchema>();
  const reviewSort = watch("reviewSort");
  const reviewDate = watch("reviewDate");
  const ratingSort = watch("ratingSort");
  const region = watch("region");

  const {
    activeFilterId,
    selectedOptions,
    selectedRegion,
    handleFilterClick: handleFilterClickHook,
    getCurrentOptionIndex,
    isActive,
    handleRegionClick: handleRegionClickHook,
  } = useFilterState({
    reviewSort,
    reviewDate,
    ratingSort,
    region,
  });
  const { data: categories } = useQuery(getReviewCategoryOptions());

  const handleFilterClick = (filterId: number, optionIndex: number) => {
    handleFilterClickHook(filterId, optionIndex, setValue);
  };

  const handleRegionClick = (regionValue: string) => {
    handleRegionClickHook(regionValue, setValue);
  };

  const getFilterLabel = (filter: FilterItem) => {
    const optionIndex =
      activeFilterId === filter.id ? getCurrentOptionIndex(filter.id) : 0;
    return filter.options[optionIndex].label;
  };

  const getChevronRotation = (filter: FilterItem) => {
    if (activeFilterId !== filter.id) return "rotate-0";
    const optionIndex = getCurrentOptionIndex(filter.id);
    return optionIndex === 0 ? "rotate-0" : "rotate-180";
  };

  useEffect(() => {
    if (viewType === "map") {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [viewType]);

  return (
    <div className="space-y-6 ">
      <div className="relative">
        <SearchFormField onFocus={() => setViewType("list")} />

        <div
          onClick={() => {
            if (viewType === "map") setSelectedClub(null);
            setViewType(viewType === "list" ? "map" : "list");
          }}
          className={cn(
            "w-10 h-10 rounded-[2px] absolute top-18 right-0 flex items-center justify-center transition-colors z-50",

            viewType === "list"
              ? "opacity-70 bg-[#0000004D]"
              : "opacity-100 bg-main"
          )}
        >
          {viewType === "list" ? (
            <Map className="size-5 text-white" />
          ) : (
            <List className="size-5 text-white" />
          )}
        </div>
      </div>

      {viewType === "list" ? (
        <>
          <div className="space-y-4">
            <KeywordList categories={categories?.data} />
            <div>
              <div className="flex gap-2 items-center">
                {regionOptions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleRegionClick(item.value)}
                    className={cn(
                      "border px-2.5 py-2 rounded-[3px] cursor-pointer transition-colors",
                      selectedRegion === item.value
                        ? "border-2 border-main text-main"
                        : "bg-transparent text-gray-700"
                    )}
                  >
                    {selectedRegion === item.value ? (
                      <Subtitle className="text-[13px] xl:text-[14px] text-main">
                        {item.label}
                      </Subtitle>
                    ) : (
                      <Description className="text-[13px] xl:text-[14px] text-black/60">
                        {item.label}
                      </Description>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Separator />

          <div className="space-y-5">
            <div
              className={cn(
                "flex transition-all duration-200",
                activeFilterId === null ? "gap-0" : "gap-4"
              )}
            >
              {filterItems.map((filter) => {
                const currentOptionIndex = getCurrentOptionIndex(filter.id);
                return (
                  <div
                    key={filter.id}
                    onClick={() =>
                      handleFilterClick(filter.id, currentOptionIndex)
                    }
                    className={cn(
                      "cursor-pointer transition-colors",
                      isActive(filter.id)
                        ? "text-black"
                        : "bg-transparent text-gray-700"
                    )}
                  >
                    <div className="flex items-center gap-0.5">
                      {isActive(filter.id) ? (
                        <Subtitle className="text-[13px] xl:text-[14px] text-black">
                          {getFilterLabel(filter)}
                        </Subtitle>
                      ) : (
                        <Description className="text-[13px] xl:text-[14px] text-black/60">
                          {getFilterLabel(filter)}
                        </Description>
                      )}
                      <div className="w-4 h-4 flex items-center justify-center">
                        <ChevronDown
                          className={cn(
                            "size-4 transition-all duration-200",
                            isActive(filter.id)
                              ? "opacity-100 scale-100"
                              : "opacity-0 scale-0",
                            getChevronRotation(filter)
                          )}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {clubs?.map((club: Club) => (
              <ClubCard
                key={club.id}
                club={club}
                onMapClick={(selectedClub: Club) => {
                  setSelectedClub(selectedClub);
                  setViewType("map");
                }}
              />
            ))}
          </div>
          {clubs.length > 0 && (
            <div className="flex justify-center pt-4 pb-4 border-t">
              <ClubsPagination
                totalPages={pagination.totalPages}
                currentPage={currentPage}
                pageNumbers={pagination.pageNumbers}
                onPageClick={pagination.handlePageClick}
                onPreviousClick={pagination.handlePreviousClick}
                onNextClick={pagination.handleNextClick}
                canGoPrevious={pagination.canGoPrevious}
                canGoNext={pagination.canGoNext}
              />
            </div>
          )}
        </>
      ) : (
        <div
          className="fixed inset-0 top-32 md:top-40 overflow-hidden"
          style={{ touchAction: "none", height: "calc(100vh - 128px)" }}
        >
          <KakaoMap club={selectedClub} clubs={clubs} />
        </div>
      )}
    </div>
  );
};

export default MobileFilter;
