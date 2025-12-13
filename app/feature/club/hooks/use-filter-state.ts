import { useState } from "react";
import { ClubSearchFormSchema } from "@/app/feature/club/schema";
import { filterItems } from "@/app/feature/club/constants";

export const useFilterState = () => {
  const [activeFilterId, setActiveFilterId] = useState<number | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, number>
  >({});
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

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
