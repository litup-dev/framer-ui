"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Club } from "@/app/feature/club/types";
import { getClubsOptions } from "@/app/feature/club/query-options";
import {
  clubSearchFormSchema,
  ClubSearchFormSchema,
  defaultValues,
} from "@/app/feature/club/schema";
import { useQuery } from "@tanstack/react-query";

import MobileFilter from "@/app/feature/club/components/mobile-filter";
import ClubCard from "@/app/feature/club/components/club-card";
import DesktopFilter from "@/app/feature/club/components/desktop-filter";

const ClubSearchForm = () => {
  const { data } = useQuery(getClubsOptions());
  const [viewType, setViewType] = useState<"list" | "map">("list");
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const form = useForm<ClubSearchFormSchema>({
    resolver: zodResolver(clubSearchFormSchema),
    defaultValues: defaultValues,
  });

  const clubs = data?.data?.items || [];

  return (
    <FormProvider {...form}>
      <div className="space-y-8">
        <div className="sm:hidden">
          <MobileFilter
            clubs={clubs}
            setViewType={setViewType}
            viewType={viewType}
            selectedClub={selectedClub}
            setSelectedClub={setSelectedClub}
          />
        </div>
        <div className="hidden sm:block">
          <DesktopFilter
            clubs={clubs}
            selectedClub={selectedClub}
            setSelectedClub={setSelectedClub}
          />
        </div>
      </div>

      <div className="space-y-6">
        {clubs.length > 0 ? (
          clubs.map((club: Club) => (
            <ClubCard key={club.id} club={club} onMapClick={() => {}} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            클럽 데이터가 없습니다.
          </div>
        )}
      </div>
    </FormProvider>
  );
};

export default ClubSearchForm;
