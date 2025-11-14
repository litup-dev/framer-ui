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

type FilterItem = (typeof filterItems)[number];

const DesktopFilter = ({
  selectedClub,
  setSelectedClub,
  clubs,
}: {
  selectedClub: Club | null;
  setSelectedClub: (club: Club | null) => void;
  clubs: Club[];
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

  const handleFilterClick = (filterId: number, optionIndex: number) => {
    const filter = filterItems.find((f) => f.id === filterId);
    if (filter) {
      const selectedValue = filter.options[optionIndex].value;
      setValue("reviewSort" as keyof ClubSearchFormSchema, selectedValue);
    }
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
    <div className="flex h-screen gap-[40px]">
      <div className="w-2/5 bg-white border-gray-200 overflow-y-auto pr-2">
        <div className="space-y-6">
          <SearchFormField />

          <div className="space-y-3">
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
                <SelectContent>
                  {region.map((item) => (
                    <SelectItem key={item.id} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filterItems.map((filter) => (
                <div
                  key={filter.id}
                  onClick={() => handleFilterClick(filter.id, 0)}
                  className={cn(
                    "border rounded-full px-4 py-2 cursor-pointer transition-colors",
                    isActive(filter.id)
                      ? "border-2 border-main text-main"
                      : "bg-transparent text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <div className="flex items-center gap-1">
                    <p className="text-chip-14">{getFilterLabel(filter)}</p>
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
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2.5">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-[#2020200A] rounded-full px-3 py-2 cursor-pointer transition-colors text-center hover:bg-[#2020201A]"
                >
                  <p className="text-chip-14">키워드</p>
                </div>
              ))}
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

      <div className="w-3/5 relative">
        <div className="absolute inset-0 -right-5 md:-right-10 lg:-right-15 xl:-right-20">
          <KakaoMap club={selectedClub} />
        </div>
      </div>
    </div>
  );
};

export default DesktopFilter;
