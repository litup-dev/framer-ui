"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Club } from "@/app/feature/club/types";

import MobileFilter from "@/app/feature/club/components/mobile-filter";
import ClubCard from "@/app/feature/club/components/club-card";
import DesktopFilter from "@/app/feature/club/components/desktop-filter";
import {
  clubSearchFormSchema,
  ClubSearchFormSchema,
  defaultValues,
} from "@/app/feature/club/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { getClubsOptions } from "../query-options";
import { useQuery } from "@tanstack/react-query";

const ClubSearchForm = () => {
  const [viewType, setViewType] = useState<"list" | "map">("list");
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const { data } = useQuery(getClubsOptions());
  const form = useForm<ClubSearchFormSchema>({
    resolver: zodResolver(clubSearchFormSchema),
    defaultValues: defaultValues,
  });

  return (
    <FormProvider {...form}>
      <div className="space-y-8">
        <div className="sm:hidden">
          <MobileFilter
            clubs={data?.clubs}
            setViewType={setViewType}
            viewType={viewType}
            selectedClub={selectedClub}
            setSelectedClub={setSelectedClub}
          />
        </div>
        <div className="hidden sm:block">
          <DesktopFilter
            clubs={data?.clubs}
            selectedClub={selectedClub}
            setSelectedClub={setSelectedClub}
          />
        </div>
      </div>
    </FormProvider>
  );
};

export default ClubSearchForm;
