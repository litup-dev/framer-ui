import { useState, useEffect, useRef } from "react";
import { ClubSearchFormSchema } from "@/app/feature/club/schema";
import { filterItems } from "@/app/feature/club/constants";

interface UseFilterStateProps {
  reviewSort?: string;
  reviewDate?: string;
  ratingSort?: string;
  region?: string;
}

export const useFilterState = (filters?: UseFilterStateProps) => {
  const [activeFilterId, setActiveFilterId] = useState<number | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, number>
  >({});
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const prevFiltersRef = useRef<string>("");

  useEffect(() => {
    if (!filters) return;

    const filtersKey = JSON.stringify({
      reviewSort: filters.reviewSort || "",
      reviewDate: filters.reviewDate || "",
      ratingSort: filters.ratingSort || "",
      region: filters.region || "",
    });

    if (prevFiltersRef.current !== filtersKey) {
      const options: Record<number, number> = {};
      let foundActiveFilter = false;

      filterItems.forEach((filter) => {
        const filterValue =
          filters[filter.fieldName as keyof UseFilterStateProps];
        if (filterValue) {
          const optionIndex = filter.options.findIndex(
            (opt) => opt.value === filterValue
          );
          if (optionIndex !== -1) {
            options[filter.id] = optionIndex;
            if (!foundActiveFilter) {
              setActiveFilterId(filter.id);
              foundActiveFilter = true;
            }
          }
        }
      });

      setSelectedOptions(options);
      if (filters.region) {
        setSelectedRegion(filters.region);
      } else {
        setSelectedRegion(null);
      }

      prevFiltersRef.current = filtersKey;
    }
  }, [
    filters?.reviewSort,
    filters?.reviewDate,
    filters?.ratingSort,
    filters?.region,
  ]);

  const toggleOption = (currentOption: number, optionIndex: number) => {
    return currentOption === optionIndex
      ? optionIndex === 0
        ? 1
        : 0
      : optionIndex;
  };

  const handleFilterClick = (
    filterId: number,
    optionIndex: number,
    setValue: (name: keyof ClubSearchFormSchema, value: any) => void
  ) => {
    const currentOption = selectedOptions[filterId];
    const newOptionIndex = toggleOption(currentOption, optionIndex);

    setSelectedOptions((prev) => ({
      ...prev,
      [filterId]: newOptionIndex,
    }));

    const filter = filterItems.find((f) => f.id === filterId);

    if (filter) {
      const selectedValue = filter.options[newOptionIndex].value;
      filterItems.forEach((f) => {
        if (f.id !== filterId) {
          setValue(f.fieldName, undefined);
        }
      });
      setValue(filter.fieldName, selectedValue);
    }

    setActiveFilterId(filterId);
  };

  const getCurrentOptionIndex = (filterId: number) => {
    return selectedOptions[filterId] ?? 0;
  };

  const isActive = (id: number) => activeFilterId === id;

  const handleRegionClick = (
    regionValue: string,
    setValue: (name: keyof ClubSearchFormSchema, value: any) => void
  ) => {
    setSelectedRegion(regionValue);
    setValue("region", regionValue);
  };

  return {
    activeFilterId,
    selectedOptions,
    selectedRegion,
    handleFilterClick,
    getCurrentOptionIndex,
    isActive,
    handleRegionClick,
  };
};
