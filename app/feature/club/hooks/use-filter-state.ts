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

  // 3-state 사이클: 비활성(undefined) → 옵션0 → 옵션1 → 해제(undefined)
  const getNextOptionIndex = (
    filterId: number,
    currentActiveId: number | null,
    currentOptions: Record<number, number>
  ): number | null => {
    if (currentActiveId !== filterId) {
      // 비활성 → 옵션0 활성화
      return 0;
    }
    const current = currentOptions[filterId] ?? 0;
    if (current === 0) {
      // 옵션0 → 옵션1
      return 1;
    }
    // 옵션1 → 해제(null)
    return null;
  };

  const handleFilterClick = (
    filterId: number,
    _optionIndex: number,
    setValue: (name: keyof ClubSearchFormSchema, value: any) => void
  ) => {
    const nextOptionIndex = getNextOptionIndex(
      filterId,
      activeFilterId,
      selectedOptions
    );

    const filter = filterItems.find((f) => f.id === filterId);

    if (nextOptionIndex === null) {
      // 해제: 이 필터 비활성화, form 값 undefined로
      setSelectedOptions((prev) => {
        const next = { ...prev };
        delete next[filterId];
        return next;
      });
      setActiveFilterId(null);
      if (filter) {
        setValue(filter.fieldName, undefined);
      }
    } else {
      setSelectedOptions((prev) => ({
        ...prev,
        [filterId]: nextOptionIndex,
      }));
      setActiveFilterId(filterId);

      if (filter) {
        const selectedValue = filter.options[nextOptionIndex].value;
        filterItems.forEach((f) => {
          if (f.id !== filterId) {
            setValue(f.fieldName, undefined);
          }
        });
        setValue(filter.fieldName, selectedValue);
      }
    }
  };

  const getCurrentOptionIndex = (filterId: number) => {
    return selectedOptions[filterId] ?? 0;
  };

  const isActive = (id: number) => activeFilterId === id;

  const handleRegionClick = (
    regionValue: string,
    setValue: (name: keyof ClubSearchFormSchema, value: any) => void
  ) => {
    // 이미 활성화된 region을 다시 클릭하면 해제
    if (selectedRegion === regionValue) {
      setSelectedRegion(null);
      setValue("region", undefined);
    } else {
      setSelectedRegion(regionValue);
      setValue("region", regionValue);
    }
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
