import PageWrapper from "@/app/shared/components/page-wrapper";
import { getServerQueryClient } from "@/lib/query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getClubByIdOptions } from "@/app/feature/club/query-options";
import ClubDetailContent from "./club-detail-content";

interface ClubDetailPageProps {
  params: Promise<{ id: string }>;
}

const ClubDetailPage = async ({ params }: ClubDetailPageProps) => {
  const { id } = await params;
  const queryClient = getServerQueryClient();

  await queryClient.prefetchQuery({
    ...getClubByIdOptions(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClubDetailContent id={id} />
    </HydrationBoundary>
  );
};

export default ClubDetailPage;
