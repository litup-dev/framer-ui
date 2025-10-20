import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

const getClubsOptions = () =>
  queryOptions({
    queryKey: ["clubs"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      console.log("클라이언트 클럽 API 호출 시작");

      const res = await apiClient.get("/api/v1/clubs");
      return res;
    },
  });

export { getClubsOptions };
