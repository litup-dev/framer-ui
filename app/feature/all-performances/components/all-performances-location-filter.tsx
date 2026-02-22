"use client";

import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import { locations } from "@/app/feature/all-performances/constants";
import { AllPerformancesFormSchema } from "@/app/feature/all-performances/schema";

import { Button } from "@/components/ui/button";
import { Subtitle } from "@/components/shared/typography";

export const AllPerformancesLocationFilter = () => {
  const { setValue, watch } = useFormContext<AllPerformancesFormSchema>();
  const area = watch("area");

  const handleLocationChange = (value: string) => {
    if (value === "all") {
      setValue("area", undefined);
    } else {
      setValue("area", value as "seoul" | "hongdae" | "busan" | "other");
    }
  };

  const isSelected = (value: string) => {
    if (value === "all") {
      return area === undefined;
    }
    return area === value;
  };

  return (
    <div className="sm:pt-22 flex gap-4 sm:gap-6">
      {locations.map((location) => (
        <Button
          key={location.id}
          className={cn(
            "text-black bg-white rounded-none hover:bg-white w-auto p-0",
          )}
          onClick={() => handleLocationChange(location.value)}
        >
          <Subtitle
            className={cn(
              "text-[16px] md:text-[18px] xl:text-[20px] 2xl:text-[24px] whitespace-nowrap",
              isSelected(location.value)
                ? "border-b-2 border-black"
                : "text-black/40",
            )}
          >
            {location.label}
          </Subtitle>
        </Button>
      ))}
    </div>
  );
};
