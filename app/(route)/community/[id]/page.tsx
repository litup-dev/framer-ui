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
      <div className="w-full min-h-screen px-5 md:px-10 md:pt-20 xl:pt-24 lg:px-40 xl:px-52 2xl:px-64 flex flex-col">
        <div className="py-8 md:py-10">
          <CommunityPostDetail postId={postId} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CommunityPostPage;
