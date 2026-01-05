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
      <div className="w-full h-screen px-5 md:px-10 lg:px-15 xl:px-20 pt-20 flex flex-col">
        <ClubSearchForm />
      </div>
    </HydrationBoundary>
  );
};

export default ClubPage;
