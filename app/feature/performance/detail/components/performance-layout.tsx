"use client";

import { useState } from "react";
import DetailMobileHeader from "./detail-mobile-header";
import NoticeSection from "./notice-section";
import Footer from "@/app/shared/components/footer";
import PosterCarousel from "./poster-carousel";
import BookingButton from "./booking-button";
import ContentTabs from "./content-tabs";
import DetailContent from "./detail-content";
import { PerformanceDetailResponse } from "../types";

interface PerformanceLayoutProps {
  posterImages: string[];
  title: string;
  performance: PerformanceDetailResponse["data"];
}

/**
 * 공연 상세 페이지 레이아웃
 * - SM, MD, LG+ 모든 레이아웃 통합
 */
const PerformanceLayout = ({ posterImages, title, performance }: PerformanceLayoutProps) => {
  // 댓글 관련 상태를 최상위 레벨에서 관리하여 모든 레이아웃에서 공유
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  return (
    <>
      {/* SM: 모바일 헤더 */}
      <div className="block md:hidden">
        <DetailMobileHeader
          performanceId={performance.id}
          performDate={performance.performDate}
          isAttend={performance.isAttend}
          performanceTitle={title}
          clubName={performance.club.name}
        />
      </div>

      {/* MD: 태블릿 레이아웃 */}
      <div className="hidden md:flex lg:hidden flex-col w-full pb-20">
        <PosterCarousel images={posterImages} title={title} variant="md" />
        <div className="px-10">
          <DetailContent
            title={title}
            performance={performance}
            commentText={commentText}
            setCommentText={setCommentText}
            editingCommentId={editingCommentId}
            setEditingCommentId={setEditingCommentId}
            editingText={editingText}
            setEditingText={setEditingText}
          />
        </div>
        <BookingButton variant="fixed" height="md" className="md:block lg:hidden" bookingUrl={performance.bookingUrl} />
      </div>

      {/* SM & LG+ 컨테이너 */}
      <div className="flex flex-col px-5 sm:px-10 md:px-15 lg:px-15 xl:px-15 2xl:px-10">
        <div className="w-full 2xl:max-w-[1760px] 2xl:mx-auto">
          <div className="mt-3 lg:mt-20 xl:mt-20 2xl:mt-20">
            {/* SM: 모바일 레이아웃 */}
            <div className="flex md:hidden flex-col w-full pb-20">
              <div className="w-screen -mx-5 sm:-mx-10">
                <PosterCarousel images={posterImages} title={title} variant="sm" />
              </div>
              <div>
                <DetailContent
                  title={title}
                  performance={performance}
                  commentText={commentText}
                  setCommentText={setCommentText}
                  editingCommentId={editingCommentId}
                  setEditingCommentId={setEditingCommentId}
                  editingText={editingText}
                  setEditingText={setEditingText}
                />
              </div>
              <BookingButton variant="fixed" height="sm" className="md:hidden" bookingUrl={performance.bookingUrl} />
            </div>

            {/* LG+: 데스크톱 레이아웃 */}
            <div className="hidden lg:block w-full">
              <div className="flex flex-row gap-20 w-full">
                <div className="w-[420px] xl:w-[490px] 2xl:w-[750px] flex-shrink-0">
                  <PosterCarousel images={posterImages} title={title} variant="lg" />
                </div>
                <div className="flex-1">
                  <DetailContent
                    title={title}
                    performance={performance}
                    commentText={commentText}
                    setCommentText={setCommentText}
                    editingCommentId={editingCommentId}
                    setEditingCommentId={setEditingCommentId}
                    editingText={editingText}
                    setEditingText={setEditingText}
                  />
                </div>
              </div>

              <div className="mt-[60px]">
                <ContentTabs
                  size="lg"
                  performanceId={performance.id}
                  commentText={commentText}
                  setCommentText={setCommentText}
                  editingCommentId={editingCommentId}
                  setEditingCommentId={setEditingCommentId}
                  editingText={editingText}
                  setEditingText={setEditingText}
                  noticeContent={
                    <NoticeSection
                      description={performance.description}
                      instagramUrl={performance.snsLinks?.[0]?.instagram}
                    />
                  }
                />
              </div>
            </div>
          </div>

          {/* LG+: Footer */}
          <div className="hidden lg:block mt-20 -mx-15 xl:-mx-15 2xl:-mx-10">
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default PerformanceLayout;
