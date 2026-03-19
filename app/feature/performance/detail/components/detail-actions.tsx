"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Subtitle } from "@/components/shared/typography";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useToggleAttendance } from "../query-options";
import { useCommonModalStore } from "@/store/common-modal-store";
import { isAfter, parseISO } from "date-fns";
import ShareModal from "./share-modal";
import { useCurrentUser } from "@/app/feature/user/hooks/use-current-user";

interface DetailActionsProps {
  performanceId: number;
  performDate: string;
  isAttend: boolean;
  performanceTitle: string;
  clubName: string;
  description?: string;
  artists?: Array<{ name: string }>;
  images?: Array<{ filePath: string; isMain: boolean }>;
}

/**
 * 공연 상세 액션 버튼 (보고 싶어요/관람했어요, 공유하기)
 */
const DetailActions = ({
  performanceId,
  performDate,
  isAttend,
  performanceTitle,
  clubName,
  description,
  artists,
  images,
}: DetailActionsProps) => {
  const { isAuthenticated } = useCurrentUser();
  const router = useRouter();
  const toggleAttendMutation = useToggleAttendance();
  const { openModal } = useCommonModalStore();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const isFutureEvent = isAfter(parseISO(performDate), new Date());

  const showLoginModal = () => {
    openModal({
      description:
        "로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?",
      confirmButton: {
        label: "확인",
        onClick: () => router.push("/login"),
      },
      cancelButton: {
        label: "취소",
        onClick: () => {},
      },
    });
  };

  const handleAttend = () => {
    if (!isAuthenticated) {
      showLoginModal();
      return;
    }
    toggleAttendMutation.mutate(performanceId);
  };

  return (
    <div className="flex gap-3">
      {/* 보고 싶어요 / 기대돼요 / 관람했어요 버튼 */}
      <div onClick={handleAttend}>
        {isAttend ? (
          // 기대돼요 / 관람했어요 (활성 상태)
          <Button
            className={cn(
              "flex items-center bg-white text-main hover:bg-gray-50",
              // 1280 이하: 112x36
              "w-[112px] h-[36px]",
              // 1600-1920: 123x40
              "xl:w-[123px] xl:h-[40px]",
              // border
              "border-[1.5px] border-main",
              // 기대돼요 vs 관람했어요 패딩
              isFutureEvent
                ? "px-[22px] py-3 xl:px-[24px] xl:py-3" // 기대돼요: 좌22 우18(아이콘포함) 상하12
                : "pl-4 pr-[10px] py-[11px] xl:pl-4 xl:pr-3 xl:py-3", // 관람했어요: 좌16 우10 상하11, xl: 좌16 우12 상하12
              // gap
              "gap-1",
            )}
          >
            <Subtitle className="xl:text-[16px] text-[14px] font-bold tracking-[-0.04em]">
              {isFutureEvent ? "기대돼요" : "관람 했어요"}
            </Subtitle>
            <Image
              src="/images/check.svg"
              alt="check"
              width={16}
              height={16}
              className="w-4 h-4 xl:w-5 xl:h-5"
            />
          </Button>
        ) : (
          // 보고 싶어요 / 관람했어요 (비활성 상태)
          <Button
            className={cn(
              "flex items-center bg-main text-white hover:bg-orange-600",
              // 1280 이하: 112x36
              "w-[112px] h-[36px]",
              // 1600-1920: 123x40
              "xl:w-[123px] xl:h-[40px]",
              // padding: 좌16 우10 상하11, xl: 좌16 우12 상하12
              "pl-4 pr-[10px] py-[11px] xl:pl-4 xl:pr-3 xl:py-3",
              // gap
              "gap-1",
            )}
          >
            <Subtitle className="xl:text-[16px] text-[14px] font-bold tracking-[-0.04em]">
              {isFutureEvent ? "보고 싶어요" : "관람 했어요"}
            </Subtitle>
            <Image
              src="/images/performance-detail/plus.svg"
              alt="plus"
              width={16}
              height={16}
              className="w-4 h-4 xl:w-5 xl:h-5"
            />
          </Button>
        )}
      </div>

      {/* 공유하기 버튼 */}
      <Button
        variant="outline"
        className={cn(
          "flex items-center bg-[#F2F1EE] hover:bg-[#E5E4E1] border-0",
          // 모바일: 36x36, 아이콘만
          "w-9 h-9 p-[9px]",
          // 1600-1920: 텍스트 + 아이콘
          "xl:w-auto xl:h-[40px] xl:pl-4 xl:pr-[13px] xl:py-3",
          // gap
          "xl:gap-1",
        )}
        onClick={() => setIsShareModalOpen(true)}
      >
        <span className="hidden xl:inline text-[#202020]">
          <Subtitle className="text-[16px] font-bold tracking-[-0.04em]">
            공유하기
          </Subtitle>
        </span>
        <Image
          src="/images/performance-detail/share.svg"
          alt="share"
          width={18}
          height={18}
          className="w-[18px] h-[18px] xl:w-5 xl:h-5"
        />
      </Button>

      {/* 공유하기 모달 */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        performanceTitle={performanceTitle}
        clubName={clubName}
        description={description}
        performDate={performDate}
        artists={artists}
        performanceId={performanceId}
        images={images}
      />
    </div>
  );
};

export default DetailActions;
