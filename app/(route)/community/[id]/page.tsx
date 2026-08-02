import { CommunityPostDetail } from "@/app/feature/community/components/community-post-detail";
import Footer from "@/app/shared/components/footer";

interface CommunityPostPageProps {
  params: Promise<{ id: string }>;
}

const CommunityPostPage = async ({ params }: CommunityPostPageProps) => {
  const { id } = await params;
  const postId = Number(id);

  return (
    <>
      <div className="w-full min-h-screen px-6 md:px-6 md:pt-24 2xl:pt-28 xl:px-[60px] 2xl:px-[120px] flex flex-col">
        <div className="pt-6 pb-24 md:py-8 xl:py-10">
          <CommunityPostDetail postId={postId} />
        </div>
      </div>
      <div className="hidden md:block">
        <Footer />
      </div>
    </>
  );
};

export default CommunityPostPage;
