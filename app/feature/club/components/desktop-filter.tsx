"use client";

import { ChevronDown } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import { ClubSearchFormSchema } from "@/app/feature/club/schema";
import { region, filterItems } from "@/app/feature/club/constants";
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
import { ReviewCategory } from "@/app/feature/club/types";
import KeywordList from "@/app/feature/club/components/keyword-list";
import { Subtitle } from "@/components/shared/typography";

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
  const { setValue } = useFormContext<ClubSearchFormSchema>();
  const {
    activeFilterId,
    selectedRegion,
    handleFilterClick: handleFilterClickHook,
    getCurrentOptionIndex,
    isActive,
    handleRegionClick: handleRegionClickHook,
  } = useFilterState();
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
      <div className="w-2/5 bg-white border-gray-200 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto pr-2 min-h-0">
          <div className="space-y-6">
            <SearchFormField />
            <div className="space-y-4">
              <KeywordList categories={categories?.data} />
              <div>
                <div className="flex gap-2 items-center">
                  <Select
                    value={selectedRegion || ""}
                    onValueChange={handleRegionClick}
                  >
                    <SelectTrigger className="rounded-full">
                      <SelectValue
                        placeholder="권역"
                        className="placeholder:text-description-14 text-black-60"
                      />
                    </SelectTrigger>
                    <SelectContent className="p-4">
                      {region.map((item) => (
                        <SelectItem key={item.id} value={item.value}>
                          <Subtitle className="text-[12px] xl:text-[14px]">
                            {item.label}
                          </Subtitle>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {filterItems.map((filter) => {
                    const currentOptionIndex = getCurrentOptionIndex(filter.id);
                    return (
                      <div
                        key={filter.id}
                        onClick={() =>
                          handleFilterClick(filter.id, currentOptionIndex)
                        }
                        className={cn(
                          "border rounded-full px-4 py-1 cursor-pointer transition-colors",
                          isActive(filter.id)
                            ? "border-2 border-main text-main"
                            : "bg-transparent text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        <div className="flex items-center gap-1">
                          {getFilterLabel(filter)}
                          {isActive(filter.id) && (
                            <ChevronDown
                              className={cn(
                                "size-4 transition-transform",
                                getChevronRotation(filter)
                              )}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <Separator />

            <div className="space-y-5">
              {clubs?.map((club: Club) => (
                <ClubCard
                  key={club.id}
                  club={club}
                  onMapClick={(selectedClub: Club) => {
                    setSelectedClub(selectedClub);
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {clubs.length > 0 && (
          <div className="flex-shrink-0 bg-white pt-4 pb-4 pr-2 border-t">
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

      <div className="w-3/5 relative flex-1 min-h-0">
        <div className="absolute inset-0 -right-5 md:-right-10 lg:-right-15 xl:-right-20">
          <KakaoMap club={selectedClub} />
        </div>
      </div>
    </div>
  );
};

export default DesktopFilter;
