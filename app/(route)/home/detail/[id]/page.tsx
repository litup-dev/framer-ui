"use client";

import { use } from "react";
import Image from "next/image";

import { eventPosters } from "@/app/feature/home/mock";

import FadeIn from "@/components/shared/fade-in";

import DesktopContent from "@/app/feature/home/detail/components/desktop-content";
import MobileContent from "@/app/feature/home/detail/components/mobile-content";

import DetailMobileHeader from "@/app/feature/home/detail/components/detail-mobile-header";

interface PostDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const DEFAULT_IMAGE = "/images/poster1.png";

const PostDetailPage = ({ params }: PostDetailPageProps) => {
  const { id } = use(params);
  const postId = parseInt(id);
  const poster = eventPosters.find((p) => p.id === postId);

  const imageUrl = poster?.image || DEFAULT_IMAGE;

  return (
    <FadeIn>
      <div className="flex flex-col justify-center px-5 sm:px-10 md:px-15 lg:px-20 min-h-screen md:pt-20">
        <div className="block md:hidden">
          <DetailMobileHeader />
        </div>
        <div className="w-full flex flex-col md:flex-row gap-4 lg:gap-[60px] bg-white">
          <div className="relative w-screen md:w-2/5 h-[442px] md:h-[560px] -mx-5 sm:-mx-10 md:mx-0 flex-shrink-0 md:rounded-md overflow-hidden bg-gray-200">
            <Image
              src={imageUrl}
              alt={poster?.title || ""}
              fill
              className="object-cover md:rounded-md"
            />
          </div>

          <div className="w-full md:w-3/5 md:border-t-4 border-[#FF491A]">
            <div className="hidden md:block">
              <DesktopContent title={poster?.title || ""} />
            </div>

            <div className="block md:hidden">
              <MobileContent title={poster?.title || ""} />
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

export default PostDetailPage;
