import { useState } from "react";
import { ClubSearchFormSchema } from "@/app/feature/club/schema";

export const useFilterState = () => {
  const [activeFilterId, setActiveFilterId] = useState<number | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, number>
  >({});
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const getFieldName = (
    filterId: number
  ): keyof ClubSearchFormSchema | null => {
    const fieldMapping: Record<number, keyof ClubSearchFormSchema> = {
      1: "reviewSort",
      2: "reviewDate",
      3: "ratingSort",
    };
    return fieldMapping[filterId] || null;
  };

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

    const fieldName = getFieldName(filterId);
    if (fieldName) {
      setValue(fieldName, newOptionIndex);
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
