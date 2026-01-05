"use client";

import { use } from "react";
import Image from "next/image";

import { eventPosters } from "@/app/feature/home/mock";

import FadeIn from "@/components/shared/fade-in";
import PerformanceDetailContent from "@/app/feature/performance/detail/components/performance-detail-content";
import DetailMobileHeader from "@/app/feature/performance/detail/components/detail-mobile-header";
import Breadcrumb from "@/app/feature/performance/detail/components/breadcrumb";
import NoticeSection from "@/app/feature/performance/detail/components/notice-section";
import Footer from "@/app/shared/components/footer";
import PosterImage from "@/app/feature/performance/detail/components/poster-image";
import BookingButton from "@/app/feature/performance/detail/components/booking-button";
import PerformanceTabs from "@/app/feature/performance/detail/components/performance-tabs";

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
      {/* SM(기본): 모바일 헤더 (높이 64px, 상하 14px 좌우 20px 패딩) - 페이지 패딩 밖 */}
      <div className="block md:hidden">
        <DetailMobileHeader />
      </div>

      {/* MD: 태블릿 레이아웃 - 페이지 패딩 밖 */}
      <div className="hidden md:flex lg:hidden flex-col w-full pb-20">
        <PosterImage
          imageUrl={imageUrl}
          title={poster?.title || ""}
          className="w-screen h-[830px]"
        />

        <div className="px-10">
          <PerformanceDetailContent title={poster?.title || ""} />
        </div>

        <BookingButton variant="fixed" height="md" className="md:block lg:hidden" />
      </div>

      <div className="flex flex-col px-5 sm:px-10 md:px-15 lg:px-15 xl:px-15 2xl:px-10">
        {/* 2XL: 최대 너비 제한 컨테이너 */}
        <div className="w-full 2xl:max-w-[1760px] 2xl:mx-auto">
          {/* LG ~ 2XL: BreadCrumb */}
          <div className="hidden lg:block lg:mt-20">
            <Breadcrumb />
          </div>

          {/* 포스터 + 공연 상세 영역 */}
          <div className="mt-3 lg:mt-3 xl:mt-5 2xl:mt-7">
            {/* SM: 모바일 레이아웃 */}
            <div className="flex md:hidden flex-col w-full pb-20">
              <PosterImage
                imageUrl={imageUrl}
                title={poster?.title || ""}
                className="w-screen h-[440px] -mx-5 sm:-mx-10"
              />

              <div>
                <PerformanceDetailContent title={poster?.title || ""} />
              </div>

              <BookingButton variant="fixed" height="sm" className="md:hidden" />
            </div>

            {/* LG ~ 2XL: 좌우 2열 레이아웃 */}
            <div className="hidden lg:block w-full">
              {/* 상단: 좌우 2열 (포스터 + 컨텐츠) */}
              <div className="flex flex-row gap-20 w-full">
                {/* 좌측: 포스터 + 미리보기 */}
                <div className="w-[420px] xl:w-[490px] 2xl:w-[750px] flex-shrink-0">
                  <PosterImage
                    imageUrl={imageUrl}
                    title={poster?.title || ""}
                    className="w-full h-[530px] xl:h-[585px] 2xl:h-[890px]"
                    sizes="(max-width: 1279px) 420px, (max-width: 1535px) 490px, 750px"
                  />

                  {/* 미리보기 이미지들 */}
                  <div className="flex gap-2 lg:gap-2 xl:gap-2 2xl:gap-2.5 mt-2 xl:mt-2 2xl:mt-2.5">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <PosterImage
                        key={i}
                        imageUrl={imageUrl}
                        title={`Preview ${i + 1}`}
                        className="w-16 h-16 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 flex-shrink-0"
                        sizes="80px"
                      />
                    ))}
                  </div>
                </div>

                {/* 우측: 컨텐츠 */}
                <div className="flex-1">
                  <PerformanceDetailContent title={poster?.title || ""} />
                </div>
              </div>

              {/* 하단: 탭 영역 */}
              <div className="mt-[60px]">
                <PerformanceTabs
                  size="lg"
                  noticeContent={<NoticeSection />}
                />
              </div>
            </div>
          </div>

          {/* LG ~ 2XL: Footer */}
          <div className="hidden lg:block mt-20 -mx-15 xl:-mx-15 2xl:-mx-10">
            <Footer />
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

export default PostDetailPage;
