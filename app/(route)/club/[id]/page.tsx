import ClubDetailContent from "@/app/(route)/club/[id]/club-detail-content";

interface ClubDetailPageProps {
  params: Promise<{ id: string }>;
}

const ClubDetailPage = async ({ params }: ClubDetailPageProps) => {
  const { id } = await params;

  return <ClubDetailContent id={id} />;
};

export default ClubDetailPage;
