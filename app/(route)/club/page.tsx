import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { getQueryClient } from "@/providers/get-query-client";
import { serverApiClient } from "@/lib/api-client";

import ClubSearchForm from "@/app/feature/club/components/serarch-form";

const ClubPage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["review-category"],
    staleTime: Infinity,
    gcTime: Infinity,
    queryFn: async () => {
      const res = await serverApiClient.get("/api/v1/common/review-category");
      return res;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full h-[calc(100vh-48px)] md:h-screen flex flex-col overflow-hidden">
        <ClubSearchForm />
      </div>
    </HydrationBoundary>
  );
};

export default ClubPage;
