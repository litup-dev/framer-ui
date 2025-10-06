import { SsgoiTransition } from "@ssgoi/react";
import { eventPosters } from "@/app/feature/home/mock";
import Image from "next/image";
import Link from "next/link";

interface PostDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const PostDetailPage = async ({ params }: PostDetailPageProps) => {
  const { id } = await params;
  const postId = parseInt(id);
  const poster = eventPosters.find((p) => p.id === postId);

  if (!poster) {
    return (
      <SsgoiTransition id={`/home/detail/${id}`}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              포스터를 찾을 수 없습니다
            </h1>
            <Link href="/home" className="text-blue-600 hover:text-blue-800">
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </SsgoiTransition>
    );
  }

  return (
    <SsgoiTransition id={`/home/detail/${id}`}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
          <div className="relative w-full h-[500px]">
            <Image
              data-hero-key={poster.id}
              src={poster.image}
              alt={poster.title}
              fill
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {poster.title}
            </h1>
            <div className="space-y-2 mb-6">
              <p className="text-lg text-gray-600">
                <span className="font-semibold">가격:</span> {poster.price}
              </p>
              <p className="text-lg text-gray-600">
                <span className="font-semibold">장소:</span> {poster.location}
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/home"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                홈으로 돌아가기
              </Link>
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                예약하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </SsgoiTransition>
  );
};

export default PostDetailPage;
