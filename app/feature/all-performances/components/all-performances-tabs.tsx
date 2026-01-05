"use client";

import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import { AllPerformancesFormSchema } from "@/app/feature/all-performances/schema";

import { Subtitle } from "@/components/shared/typography";
import { Button } from "@/components/ui/button";

export const AllPerformancesTabs = () => {
  const { setValue, watch } = useFormContext<AllPerformancesFormSchema>();
  const timeFilter = watch("timeFilter");

  return (
    <div className="flex gap-0 sm:gap-2">
      <Button
        className={cn(
          "h-[34px] sm:h-[44px]",
          timeFilter === "upcoming"
            ? "bg-black hover:bg-black"
            : "bg-white text-black/40 hover:bg-white hover:text-black"
        )}
        onClick={() => setValue("timeFilter", "upcoming")}
      >
        <Subtitle className="text-[16px]">다가올 공연</Subtitle>
      </Button>
      <Button
        className={cn(
          "h-[34px] sm:h-[44px]",
          timeFilter === "past"
            ? "bg-black hover:bg-black"
            : "bg-white text-black/40 hover:bg-white hover:text-black"
        )}
        onClick={() => setValue("timeFilter", "past")}
      >
        <Subtitle className="text-[16px]">지난 공연</Subtitle>
      </Button>
    </div>
  );
};
