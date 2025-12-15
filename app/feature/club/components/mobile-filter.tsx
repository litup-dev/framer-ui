"use client";

import { Map } from "lucide-react";
import { ChevronDown, List } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { ClubSearchFormSchema } from "@/app/feature/club/schema";
import { region, filterItems } from "@/app/feature/club/constants";
import { useFilterState } from "@/app/feature/club/hooks/use-filter-state";
import { getReviewCategoryOptions } from "@/app/feature/club/query-options";
import { ReviewCategory } from "@/app/feature/club/types";

import { Title } from "@/components/shared/typography";
import { Separator } from "@/components/ui/separator";
import KakaoMap from "@/app/feature/club/components/kakao-map";
import SearchFormField from "@/app/feature/club/components/search-form-field";
import { Club } from "@/app/feature/club/types";
import ClubCard from "@/app/feature/club/components/club-card";

type FilterItem = (typeof filterItems)[number];

const MobileFilter = ({
  setViewType,
  viewType,
  selectedClub,
  setSelectedClub,
  clubs,
}: {
  setViewType: (viewType: "list" | "map") => void;
  viewType: "list" | "map";
  selectedClub: Club | null;
  setSelectedClub: (club: Club | null) => void;
  clubs: Club[];
}) => {
  const { setValue } = useFormContext<ClubSearchFormSchema>();
  const {
    activeFilterId,
    selectedOptions,
    selectedRegion,
    handleFilterClick: handleFilterClickHook,
    getCurrentOptionIndex,
    isActive,
    handleRegionClick: handleRegionClickHook,
  } = useFilterState();
  const { data } = useQuery(getReviewCategoryOptions());
  const categories = (data as any)?.data as ReviewCategory[] | undefined;

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
          <div className="space-y-3">
            <Title className="text-title-16">권역</Title>
            <div className="flex gap-2.5">
              {region.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleRegionClick(item.value)}
                  className={cn(
                    "border rounded-full px-3 py-2 cursor-pointer transition-colors",
                    selectedRegion === item.value
                      ? "border-2 border-main text-main"
                      : "bg-transparent text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <p className="text-chip-14">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Title className="text-title-16">키워드</Title>
            <div className={cn("space-y-2")}>
              <div className="grid grid-cols-4 gap-2.5 max-w-[82%]">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-[#2020200A] rounded-full px-3 py-2 cursor-pointer transition-colors text-center"
                  >
                    <p className="text-chip-14">키워드</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex gap-2.5">
            {filterItems.map((filter) => {
              const currentOptionIndex = getCurrentOptionIndex(filter.id);
              return (
                <div
                  key={filter.id}
                  onClick={() =>
                    handleFilterClick(filter.id, currentOptionIndex)
                  }
                  className={cn(
                    "border rounded-full px-3 py-2 cursor-pointer transition-colors",
                    isActive(filter.id)
                      ? "border-2 border-main text-main"
                      : "bg-transparent text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <div className="flex items-center">
                    <p className="text-chip-14">{getFilterLabel(filter)}</p>
                    {isActive(filter.id) && (
                      <ChevronDown
                        className={cn(
                          "size-5 transition-transform",
                          getChevronRotation(filter)
                        )}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-5">
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
        </>
      ) : (
        <div className="fixed top-32 left-0 right-0 bottom-0 h-[calc(100vh-120px)] overflow-hidden">
          <KakaoMap club={selectedClub} />
        </div>
      )}
    </div>
  );
};

export default MobileFilter;
