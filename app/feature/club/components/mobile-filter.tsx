"use client";

import { useEffect } from "react";
import { Map } from "lucide-react";
import { ChevronDown, List } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { ClubSearchFormSchema } from "@/app/feature/club/schema";
import { region, filterItems } from "@/app/feature/club/constants";
import { useFilterState } from "@/app/feature/club/hooks/use-filter-state";
import { getReviewCategoryOptions } from "@/app/feature/club/query-options";

import { Subtitle } from "@/components/shared/typography";
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
import KeywordList from "@/app/feature/club/components/keyword-list";

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
                        <span className="text-description-14 text-black-60">
                          {getFilterLabel(filter)}
                        </span>
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
                  setViewType("map");
                }}
              />
            ))}
          </div>
        </>
      ) : (
        <div
          className="fixed inset-0 top-32 overflow-hidden"
          style={{ touchAction: "none", height: "calc(100vh - 128px)" }}
        >
          <KakaoMap club={selectedClub} clubs={clubs} />
        </div>
      )}
    </div>
  );
};

export default MobileFilter;
