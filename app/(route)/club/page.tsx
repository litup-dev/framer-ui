import PageWrapper from "@/app/shared/components/page-wrapper";
import { getServerQueryClient } from "@/lib/query-client";
import { serverApiClient } from "@/lib/api-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import ClubSearchForm from "@/app/feature/club/components/serarch-form";

const ClubPage = async () => {
  const queryClient = getServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["clubs"],
    staleTime: 5,
    queryFn: async () => {
      const res = await serverApiClient.get("/api/v1/clubs");
      return res;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PageWrapper>
        <ClubSearchForm />
      </PageWrapper>
    </HydrationBoundary>
  );
};

export default ClubPage;
