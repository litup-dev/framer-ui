"use client";

import { useState } from "react";
import { Share2, Plus, Check, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Subtitle } from "@/components/shared/typography";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useToggleAttendance } from "../query-options";
import { useCommonModalStore } from "@/store/common-modal-store";
import { isAfter, parseISO } from "date-fns";
import ShareModal from "./share-modal";
import { useUserStore } from "@/store/user-store";

interface DetailActionsProps {
  performanceId: number;
  performDate: string;
  isAttend: boolean;
  performanceTitle: string;
  clubName: string;
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
}: DetailActionsProps) => {
  const { isAuthenticated } = useUserStore();
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
      {/* 보고 싶어요 / 관람했어요 버튼 */}
      <div onClick={handleAttend}>
        {isAttend ? (
          <Button className="flex w-[112px] h-[36px] xl:w-[123px] xl:h-[40px] border border-main bg-white text-main hover:bg-gray-50 items-center justify-center gap-1">
            <Subtitle className="text-[14px] xl:text-[16px]">
              {isFutureEvent ? "기대돼요" : "관람했어요"}
            </Subtitle>
            <Check className="w-4 h-4 xl:w-5 xl:h-5" />
          </Button>
        ) : (
          <Button className="flex w-[112px] h-[36px] xl:w-[123px] xl:h-[40px] bg-main text-white hover:bg-orange-600 items-center justify-center gap-1">
            <Subtitle className="text-[14px] xl:text-[16px]">
              {isFutureEvent ? "보고 싶어요" : "관람했어요"}
            </Subtitle>
            <Plus className="w-4 h-4 xl:w-5 xl:h-5" />
          </Button>
        )}
      </div>

      {/* 공유하기 버튼 */}
      <Button
        variant="outline"
        className="flex items-center gap-1 h-[36px] xl:h-[40px] w-[99px] 2xl:w-[108px] bg-[#F2F1EE]"
        onClick={() => setIsShareModalOpen(true)}
      >
        공유하기
        <Share2 className="w-5 h-5" />
      </Button>

      {/* 공유하기 모달 */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        performanceTitle={performanceTitle}
        clubName={clubName}
        performanceId={performanceId}
      />
    </div>
  );
};

export default DetailActions;
