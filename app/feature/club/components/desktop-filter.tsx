"use client";

import { ChevronDown } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import { ClubSearchFormSchema } from "@/app/feature/club/schema";
import {
  region as regionOptions,
  filterItems,
} from "@/app/feature/club/constants";
import { useFilterState } from "@/app/feature/club/hooks/use-filter-state";

import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import KakaoMap from "@/app/feature/club/components/kakao-map";
import SearchFormField from "@/app/feature/club/components/search-form-field";
import { Club } from "@/app/feature/club/types";
import ClubCard from "@/app/feature/club/components/club-card";
import { ClubsPagination } from "@/app/feature/club/components/clubs-pagination";
import { useQuery } from "@tanstack/react-query";
import { getReviewCategoryOptions } from "../query-options";
import KeywordList from "@/app/feature/club/components/keyword-list";
import { Description, Subtitle } from "@/components/shared/typography";
import Image from "next/image";

type FilterItem = (typeof filterItems)[number];

const DesktopFilter = ({
  selectedClub,
  setSelectedClub,
  clubs,
  pagination,
  currentPage,
}: {
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

  return (
    <div className="flex h-full gap-[40px]">
      <div className="w-3/8 bg-white border-gray-200 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto  min-h-0">
          <div className="space-y-6">
            <SearchFormField />
            <div className="space-y-4">
              <KeywordList categories={categories?.data} />
              <div>
                <div className="flex gap-2 items-center">
                  <Select
                    value={
                      selectedRegion === "nearby" ? "" : selectedRegion || ""
                    }
                    onValueChange={handleRegionClick}
                  >
                    <SelectTrigger
                      className="rounded-[3px] p-2.5 border-gray-300 h-auto"
                      visibleIcon={false}
                    >
                      <div className="flex items-center gap-0.5">
                        <SelectValue
                          placeholder="권역"
                          className="text-[14px] xl:text-[16px]"
                        />
                        <Image
                          src="/images/location.svg"
                          alt="arrow-down"
                          width={20}
                          height={20}
                        />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="p-4">
                      {regionOptions
                        .filter((item) => item.label !== "내 주변")
                        .map((item) => (
                          <SelectItem key={item.id} value={item.value}>
                            <Subtitle className="text-[14px] xl:text-[16px]">
                              {item.label}
                            </Subtitle>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <div
                    onClick={() => handleRegionClick("nearby")}
                    className={cn(
                      "rounded-[4px] cursor-pointer transition-colors p-2.5 border box-border",
                      selectedRegion === "nearby"
                        ? "border-main text-main border-2"
                        : "bg-transparent text-gray-700 hover:bg-gray-100 border-gray-300",
                    )}
                  >
                    {selectedRegion === "nearby" ? (
                      <Subtitle className="text-[14px] xl:text-[16px] text-main">
                        내 주변
                      </Subtitle>
                    ) : (
                      <Description className="text-[14px] xl:text-[16px] text-black/60">
                        내 주변
                      </Description>
                    )}
                  </div>
                  {filterItems.map((filter) => {
                    const currentOptionIndex = getCurrentOptionIndex(filter.id);
                    return (
                      <div
                        key={filter.id}
                        onClick={() =>
                          handleFilterClick(filter.id, currentOptionIndex)
                        }
                        className={cn(
                          "rounded-[4px] cursor-pointer transition-colors p-2.5 border box-border",
                          isActive(filter.id)
                            ? "border-main text-main border-2"
                            : "bg-transparent text-gray-700 hover:bg-gray-100 border-gray-300",
                        )}
                      >
                        <div className="flex items-center gap-1">
                          {isActive(filter.id) ? (
                            <Subtitle className="text-[14px] xl:text-[16px] text-main">
                              {getFilterLabel(filter)}
                            </Subtitle>
                          ) : (
                            <Description className="text-[14px] xl:text-[16px] text-black/60">
                              {getFilterLabel(filter)}
                            </Description>
                          )}
                          <div
                            className={cn(
                              "flex items-center justify-center flex-shrink-0",
                              isActive(filter.id) ? "w-4 h-4 " : "w-0 h-0",
                            )}
                          >
                            {isActive(filter.id) && (
                              <ChevronDown
                                className={cn(
                                  "size-6 transition-transform",
                                  getChevronRotation(filter),
                                )}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <Separator />

            <div className="space-y-5 pb-5 flex flex-col">
              {clubs?.map((club: Club, index: number) => (
                <div key={club.id}>
                  <ClubCard
                    club={club}
                    onMapClick={(selectedClub: Club) => {
                      setSelectedClub(selectedClub);
                    }}
                  />
                  {index !== clubs.length - 1 && (
                    <Separator className="hidden lg:block lg:mt-6" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {clubs.length > 0 && (
          <div className="flex-shrink-0 bg-white flex flex-col min-h-[80px] items-center justify-center relative">
            <div
              className="absolute left-1/2 top-0 -translate-x-1/2 w-screen border-t border-black/20 pointer-events-none"
              aria-hidden
            />
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
      </div>

      <div className="hidden xl:block w-3/5 relative flex-1 min-h-0">
        <div className="absolute inset-0 -right-5 md:-right-10 lg:-right-15 xl:-right-20">
          <KakaoMap club={selectedClub} clubs={clubs} />
        </div>
      </div>
    </div>
  );
};

export default DesktopFilter;
