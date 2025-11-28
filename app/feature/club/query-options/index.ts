import { queryOptions } from "@tanstack/react-query";
import { ClubDetail } from "@/app/feature/club/types";
import { apiClient } from "@/lib/api-client";

const getClubsOptions = () =>
  queryOptions({
    queryKey: ["clubs"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/clubs");
      return response;
    },
  });

const getClubByIdOptions = (id: string) =>
  queryOptions<ClubDetail>({
    queryKey: ["club", id],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const response = await apiClient.get<ClubDetail>(`/api/v1/clubs/${id}`);
      return response;
    },
  });

export { getClubsOptions, getClubByIdOptions };
