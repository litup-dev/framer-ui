import { SelectItemValue } from "@/app/feature/home/constants";

export const getQueryParams = (
  selectedCategory: SelectItemValue,
  selectedArea: string
) => {
  const isFree = selectedCategory === "free" ? true : undefined;
  const area =
    selectedCategory === "area" && selectedArea ? selectedArea : undefined;

  return { isFree, area };
};
