import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { getQueryClient } from "@/providers/get-query-client";
import { getClubByIdOptions } from "@/app/feature/club/query-options";

import ClubDetailContent from "@/app/(route)/club/[id]/club-detail-content";

interface ClubDetailPageProps {
  params: Promise<{ id: string }>;
}

const ClubDetailPage = async ({ params }: ClubDetailPageProps) => {
  const { id } = await params;
  const queryClient = getQueryClient();

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
