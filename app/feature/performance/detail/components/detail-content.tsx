import { Subtitle } from "@/components/shared/typography";
import DetailActions from "./detail-actions";
import InfoSections from "./info-sections";
import NoticeSection from "./notice-section";
import ContentTabs from "./content-tabs";
import BookingButton from "./booking-button";
import { PerformanceDetailResponse } from "../types";

interface DetailContentProps {
  title: string;
  performance: PerformanceDetailResponse["data"];
  commentText: string;
  setCommentText: (text: string) => void;
  editingCommentId: number | null;
  setEditingCommentId: (id: number | null) => void;
  editingText: string;
  setEditingText: (text: string) => void;
}

const DetailContent = ({
  title,
  performance,
  commentText,
  setCommentText,
  editingCommentId,
  setEditingCommentId,
  editingText,
  setEditingText
}: DetailContentProps) => {

  return (
    <>
      {/* LG ~ 2XL: 상단 우측 영역 - 공연명, 버튼, 상세정보 */}
      <div className="hidden lg:flex flex-col">
        {/* 2XL, XL: 클럽명, 공연명, 버튼 (버튼 우측) */}
        <div className="hidden xl:flex justify-between items-start">
          <div className="flex flex-col">
            <Subtitle className="text-black-60 text-[16px] 2xl:text-[18px] mb-2.5 xl:mb-2.5 2xl:mb-3">
              {performance.club.name}
            </Subtitle>
            <Subtitle className="text-[24px] 2xl:text-[28px]">
              {title}
            </Subtitle>
          </div>
          <div className="self-end">
            <DetailActions
              performanceId={performance.id}
              performDate={performance.performDate}
              isAttend={performance.isAttend}
              performanceTitle={title}
              clubName={performance.club.name}
            />
          </div>
        </div>

        {/* LG: 클럽명, 버튼 (버튼 하단), 공연명 */}
        <div className="flex xl:hidden flex-col">
          <Subtitle className="text-black-60 text-[14px] mb-2">
            {performance.club.name}
          </Subtitle>
          <Subtitle className="text-[20px]">
            {title}
          </Subtitle>
          <div className="mt-4">
            <DetailActions
              performanceId={performance.id}
              performDate={performance.performDate}
              isAttend={performance.isAttend}
              performanceTitle={title}
              clubName={performance.club.name}
            />
          </div>
        </div>

        {/* Separator: 2XL 24px(mt-6), XL 20px(mt-5), LG 16px(mt-4) */}
        <div className="h-[3px] bg-main mt-4 xl:mt-5 2xl:mt-6" />

        {/* 상세 정보: 2XL 56px(mt-14), XL 40px(mt-10), LG 32px(mt-8) */}
        <div className="mt-8 xl:mt-10 2xl:mt-14">
          <InfoSections performance={performance} />
        </div>

        {/* 예매하기 버튼 */}
        <div className="mt-[60px]">
          <BookingButton height="lg" bookingUrl={performance.bookingUrl} />
        </div>
      </div>

      {/* MD: 태블릿 레이아웃 */}
      <div className="hidden md:block lg:hidden">
        <div className="flex justify-between items-center mt-5">
          <Subtitle className="text-[20px]">{title}</Subtitle>
          <DetailActions
            performanceId={performance.id}
            performDate={performance.performDate}
            isAttend={performance.isAttend}
            performanceTitle={title}
            clubName={performance.club.name}
          />
        </div>

        {/* 탭 */}
        <div className="mt-7">
          <ContentTabs
            size="md"
            performanceId={performance.id}
            commentText={commentText}
            setCommentText={setCommentText}
            editingCommentId={editingCommentId}
            setEditingCommentId={setEditingCommentId}
            editingText={editingText}
            setEditingText={setEditingText}
            noticeContent={
              <>
                <InfoSections variant="md" performance={performance} />
                <div className="mt-6">
                  <NoticeSection
                    description={performance.description}
                    instagramUrl={performance.snsLinks?.[0]?.instagram}
                  />
                </div>
              </>
            }
          />
        </div>
      </div>

      {/* SM: 모바일 레이아웃 */}
      <div className="block md:hidden">
        {/* 클럽명: 포스터 20px 아래, 18px */}
        <Subtitle className="text-[18px] mt-5">
          {title}
        </Subtitle>

        {/* 탭 */}
        <div className="mt-4">
          <ContentTabs
            size="sm"
            performanceId={performance.id}
            commentText={commentText}
            setCommentText={setCommentText}
            editingCommentId={editingCommentId}
            setEditingCommentId={setEditingCommentId}
            editingText={editingText}
            setEditingText={setEditingText}
            noticeContent={
              <>
                <InfoSections variant="sm" performance={performance} />
                <div className="mt-4">
                  <NoticeSection
                    description={performance.description}
                    instagramUrl={performance.snsLinks?.[0]?.instagram}
                  />
                </div>
              </>
            }
          />
        </div>
      </div>
    </>
  );
};

export default DetailContent;
